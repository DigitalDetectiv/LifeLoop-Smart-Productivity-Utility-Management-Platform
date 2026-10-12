import { toChipVar } from '../../utils/colors.js';
import FlipCoin from '../FlipCoin/FlipCoin.jsx';

// Recurring tasks already arrive in the main `tasks` array (from
// /api/tasks/today) with `isRecurring: true` and `done` reflecting
// whether today's completion row exists - this just filters and
// displays that real data, and the FlipCoin now calls the same
// onToggleTask used everywhere else, so a flip here actually persists
// (POST /api/tasks/:id/toggle) instead of only flipping local state
// that reset on every reload.
export default function RecurringDonut({ tasks, onToggleTask }) {
  const recurring = tasks.filter((t) => t.isRecurring);
  const completed = recurring.filter((t) => t.done).length;
  const percentComplete = recurring.length === 0 ? 0 : Math.round((completed / recurring.length) * 100);

  const donutStyle = {
    background: `conic-gradient(var(--sage-dot) 0% ${percentComplete}%, var(--border) ${percentComplete}% 100%)`
  };

  if (recurring.length === 0) {
    return (
      <div className="recurring-row recurring-empty">
        <p>No recurring habits yet - add one from a list in Health & fitness, or anywhere else.</p>
      </div>
    );
  }

  return (
    <div className="recurring-row">
      <div className="donut" style={donutStyle}>
        <span className="donut-percent">{percentComplete}%</span>
      </div>
      <div className="recurring-list">
        {recurring.map((t) => (
          <div key={t.id} className="rec-pill">
            <FlipCoin done={t.done} onToggle={() => onToggleTask(t.id)} colorVar={toChipVar(t.tagSoftVar)} size={22} />
            <span className={t.done ? 'rec-pill-done' : undefined}>{t.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
