import { formatTime12 } from '../../utils/time.js';

// Not-done first, then by time (untimed tasks sort last). The old
// version sorted by `a.id - b.id`, which does nothing meaningful once
// ids are real UUID strings instead of mock numeric ids.
function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return String(a.time || '99:99').localeCompare(String(b.time || '99:99'));
  });
}

export default function CompactTaskList({ tasks, onToggleDone, onSelect, selectedId }) {
  const sorted = sortTasks(tasks);
  const nextUpId = sorted.find((t) => !t.done)?.id;

  return (
    <div className="compact-list">
      {sorted.map((t) => (
        <div
          className={`compact-row${selectedId === t.id ? ' selected' : ''}${t.id === nextUpId ? ' next-up' : ''}`}
          key={t.id}
          onClick={() => onSelect?.(t.id)}
        >
          <span
            className={`compact-check${t.done ? ' done' : ''}`}
            onClick={(e) => { e.stopPropagation(); onToggleDone?.(t.id); }}
            role="button"
            aria-label={t.done ? 'Mark incomplete' : 'Mark complete'}
          />
          <span className="compact-time mono">{formatTime12(t.time)}</span>
          <span className="compact-title">{t.title}</span>
          {t.id === nextUpId && <span className="next-up-badge">Next up</span>}
        </div>
      ))}
    </div>
  );
}
