import { useState, useEffect, useCallback } from 'react';
import './FolderSystem.css';
import Icon from '../Icon/Icon.jsx';
import FlipCoin from '../FlipCoin/FlipCoin.jsx';
import ScheduleFields, { emptySchedule, scheduleToPayload, isScheduleValid } from '../ScheduleFields/ScheduleFields.jsx';
import { formatTime12 } from '../../utils/time.js';
import { fetchFolderNodes, createFolderNode, updateFolderNode, deleteFolderNode } from '../../api/folderNodes.js';
import { fetchTasksForFolder, createTask, toggleTask as apiToggleTask, deleteTask as apiDeleteTask } from '../../api/tasks.js';

const TYPE_ICONS = { folder: 'folder', list: 'plus', notepad: 'note' };
const TYPE_LABELS = { folder: 'Folder', list: 'List', notepad: 'Notepad' };
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function describeSchedule(t) {
  const time = t.time ? ` · ${formatTime12(t.time)}` : '';
  if (t.isRecurring) {
    const rule = t.recurrenceRule || {};
    if (rule.freq === 'daily') return `Every day${time}`;
    return `${(rule.days || []).map((d) => DAY_NAMES[d]).join(', ')}${time}`;
  }
  return `${t.dueDate ? String(t.dueDate).slice(0, 10) : ''}${time}`;
}

// Orders a list so it reads in the order things need doing: not-done
// first, then by date, then by time (untimed last within a day).
// Recurring tasks have no fixed date, so they sort by time alone.
function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const da = a.isRecurring ? '' : String(a.dueDate || '9999');
    const db = b.isRecurring ? '' : String(b.dueDate || '9999');
    if (da !== db) return da.localeCompare(db);
    return String(a.time || '99:99').localeCompare(String(b.time || '99:99'));
  });
}

// Real, per-account data: every node is fetched from and saved to the
// backend (folder_nodes + tasks), scoped to categoryId.
export default function FolderSystem({ categoryId, accentVar = '--purple-dot', allowRecurring = true }) {
  const [nodes, setNodes] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [openNodeId, setOpenNodeId] = useState(null);
  const [tasksByNode, setTasksByNode] = useState({});
  const [tasksLoading, setTasksLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftType, setDraftType] = useState('list');
  const [draftTitle, setDraftTitle] = useState('');
  const [schedule, setSchedule] = useState(emptySchedule());
  const [error, setError] = useState('');

  useEffect(() => {
    if (!categoryId) return;
    fetchFolderNodes(categoryId)
      .then((list) => {
        setNodes(Object.fromEntries(list.map((n) => [n.id, n])));
        setLoaded(true);
      })
      .catch((err) => {
        setError(err.message);
        setLoaded(true);
      });
  }, [categoryId]);

  const currentNode = openNodeId ? nodes[openNodeId] : null;
  const childrenOf = (parentId) => Object.values(nodes).filter((n) => n.parentId === parentId);

  const loadTasksFor = useCallback((nodeId) => {
    setTasksLoading(true);
    fetchTasksForFolder(nodeId)
      .then((tasks) => setTasksByNode((prev) => ({ ...prev, [nodeId]: tasks })))
      .catch((err) => setError(err.message))
      .finally(() => setTasksLoading(false));
  }, []);

  const openNode = (id) => {
    setOpenNodeId(id);
    if (nodes[id]?.type === 'list' && !tasksByNode[id]) loadTasksFor(id);
  };

  const createNode = async (e) => {
    e.preventDefault();
    if (!draftName.trim()) return;
    try {
      const node = await createFolderNode({ categoryId, parentId: openNodeId, type: draftType, name: draftName.trim() });
      setNodes((prev) => ({ ...prev, [node.id]: node }));
      setDraftName('');
      setCreating(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteNode = async (nodeId) => {
    if (!window.confirm('Delete this and everything inside it?')) return;
    await deleteFolderNode(nodeId);
    const parentId = nodes[nodeId]?.parentId ?? null;
    setNodes((prev) => {
      const next = { ...prev };
      delete next[nodeId];
      return next;
    });
    setOpenNodeId(parentId);
  };

  const toggleTaskDone = (nodeId, taskId) => {
    setTasksByNode((prev) => ({
      ...prev,
      [nodeId]: prev[nodeId].map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    }));
    apiToggleTask(taskId).catch(() => loadTasksFor(nodeId));
  };

  const deleteTaskRow = (nodeId, taskId) => {
    setTasksByNode((prev) => ({ ...prev, [nodeId]: prev[nodeId].filter((t) => t.id !== taskId) }));
    apiDeleteTask(taskId).catch(() => loadTasksFor(nodeId));
  };

  const addTask = async (nodeId, e) => {
    e.preventDefault();
    if (!draftTitle.trim() || !isScheduleValid(schedule)) return;
    try {
      const task = await createTask({
        categoryId,
        folderNodeId: nodeId,
        title: draftTitle.trim(),
        ...scheduleToPayload(schedule)
      });
      setTasksByNode((prev) => ({ ...prev, [nodeId]: [...(prev[nodeId] ?? []), task] }));
      setDraftTitle('');
      setSchedule(emptySchedule());
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const goBack = () => setOpenNodeId(currentNode?.parentId ?? null);

  const createForm = (
    <form className="folder-create-form" onSubmit={createNode}>
      <input autoFocus value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="Name..." />
      <select value={draftType} onChange={(e) => setDraftType(e.target.value)}>
        <option value="folder">Folder</option>
        <option value="list">List (scheduled tasks)</option>
        <option value="notepad">Notepad</option>
      </select>
      <button type="submit">Add</button>
      <button type="button" className="folder-create-cancel" onClick={() => setCreating(false)}>Cancel</button>
    </form>
  );

  if (!loaded) return <p className="tasks-loading">Loading…</p>;

  const toolbar = (label) => (
    <div className="folder-toolbar">
      <button className="folder-back" onClick={goBack}>
        <Icon name="chevronLeft" size={14} /> Back
      </button>
      <button className="folder-delete-btn" onClick={() => deleteNode(currentNode.id)}>
        <Icon name="close" size={13} /> Delete this {label}
      </button>
    </div>
  );

  // Root level or inside a folder: show the children.
  if (!currentNode || currentNode.type === 'folder') {
    const list = childrenOf(currentNode ? currentNode.id : null);
    const isRoot = !currentNode;
    const accentSoft = `var(${accentVar.replace('-dot', '-soft')})`;
    const accentChip = `var(${accentVar.replace('-dot', '-chip')})`;

    const cards = list.map((node) => (
      <div
        className="folder-card"
        key={node.id}
        onClick={() => openNode(node.id)}
        style={{ '--accent-soft': accentSoft, '--accent-strong': accentChip }}
      >
        <span className="folder-card-icon"><Icon name={TYPE_ICONS[node.type]} size={20} /></span>
        <p className="folder-card-name">{node.name}</p>
        <p className="folder-card-type">{TYPE_LABELS[node.type]}</p>
      </div>
    ));

    return (
      <div className="folder-system">
        {currentNode && toolbar('folder')}
        {error && <p className="login-error">{error}</p>}

        {isRoot ? (
          <div className="folder-strip">
            {cards}
            <button className="folder-strip-add" onClick={() => setCreating(true)}>
              <Icon name="plus" size={18} />
              <span>New</span>
            </button>
          </div>
        ) : (
          <div className="folder-grid">{cards}</div>
        )}

        {!isRoot && !creating && (
          <button className="folder-add-btn" onClick={() => setCreating(true)}>
            <Icon name="plus" size={15} /> New
          </button>
        )}
        {creating && createForm}

        {list.length === 0 && !creating && (
          <p className="subcat-empty">Nothing here yet - click "New" to add a folder, a scheduled list, or a note.</p>
        )}
      </div>
    );
  }

  // List: scheduled tasks, ordered by when they need doing.
  if (currentNode.type === 'list') {
    const tasks = sortTasks(tasksByNode[currentNode.id] ?? []);
    const nextUpId = tasks.find((t) => !t.done)?.id;

    return (
      <div className="folder-system">
        {toolbar('list')}
        {error && <p className="login-error">{error}</p>}

        <div className="folder-list-view">
          {tasksLoading && <p className="subcat-empty">Loading…</p>}
          {!tasksLoading && tasks.length === 0 && <p className="subcat-empty">Nothing scheduled yet - add your first item below.</p>}
          {tasks.map((t) => (
            <div className={`subcat-task-row${t.id === nextUpId ? ' next-up' : ''}`} key={t.id}>
              {allowRecurring && t.isRecurring ? (
                <FlipCoin done={t.done} onToggle={() => toggleTaskDone(currentNode.id, t.id)} colorVar="--sage-chip" size={28} />
              ) : (
                <span
                  className={`compact-check${t.done ? ' done' : ''}`}
                  onClick={() => toggleTaskDone(currentNode.id, t.id)}
                  role="button"
                  aria-label={t.done ? 'Mark incomplete' : 'Mark complete'}
                />
              )}
              <span className={`subcat-task-title${t.done ? ' done' : ''}`}>{t.title}</span>
              {t.id === nextUpId && <span className="next-up-badge">Next up</span>}
              <span className="subcat-task-time mono">{describeSchedule(t)}</span>
              <span className="subcat-delete" onClick={() => deleteTaskRow(currentNode.id, t.id)} role="button" aria-label="Delete">
                <Icon name="close" size={14} />
              </span>
            </div>
          ))}

          <form className="folder-add-task-form" onSubmit={(e) => addTask(currentNode.id, e)}>
            <input
              className="folder-add-task-title"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="Add an item..."
            />
            <ScheduleFields value={schedule} onChange={setSchedule} />
            <button type="submit" className="folder-add-task-submit">
              <Icon name="plus" size={14} /> Add to list
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Notepad: free text, saved when you click away.
  return (
    <div className="folder-system">
      {toolbar('note')}
      <textarea
        className="notepad-area"
        value={currentNode.note ?? ''}
        onChange={(e) => setNodes((prev) => ({ ...prev, [currentNode.id]: { ...prev[currentNode.id], note: e.target.value } }))}
        onBlur={() => updateFolderNode(currentNode.id, { note: nodes[currentNode.id]?.note ?? '' }).catch(() => {})}
        placeholder="Write anything..."
      />
    </div>
  );
}
