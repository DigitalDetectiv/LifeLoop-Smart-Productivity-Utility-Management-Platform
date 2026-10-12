import { categories } from '../../data/mockData.js';
import { toChipVar } from '../../utils/colors.js';
import { formatTime12 } from '../../utils/time.js';
import Icon from '../Icon/Icon.jsx';

export default function TaskDetailPanel({ task, onClose, onToggleDone }) {
  if (!task) {
    return (
      <div className="detail-panel detail-panel-empty">
        <span className="detail-panel-empty-icon"><Icon name="note" size={28} /></span>
        <span className="detail-hint">Select a task on the left to see its details</span>
      </div>
    );
  }

  const category = categories.find((c) => c.id === task.category);

  return (
    <div className="detail-panel">
      <button className="detail-close" onClick={onClose} aria-label="Close details">&times;</button>
      <span className="task-tag" style={{ background: `var(${toChipVar(task.tagSoftVar)})` }}>
        {category?.name ?? task.category}
      </span>
      <p className="detail-title voice">{task.title}</p>
      {task.time && <p className="task-time mono">{formatTime12(task.time)}</p>}
      <div className="task-actions">
        <div
          className={`complete-dot${task.done ? ' done' : ''}`}
          onClick={() => onToggleDone?.(task.id)}
          role="button"
          aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
        />
        <span className="detail-status">{task.done ? 'Completed' : 'Not done yet'}</span>
      </div>
    </div>
  );
}
