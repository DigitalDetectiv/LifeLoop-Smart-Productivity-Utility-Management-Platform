import './StatCards.css';
import Icon from '../Icon/Icon.jsx';

export default function StatCards({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.done).length;
  const remaining = total - completed;

  const stats = [
    { icon: 'check', label: 'Total tasks today', value: total, chipVar: '--purple-chip' },
    { icon: 'clock', label: 'Completed', value: completed, chipVar: '--sage-chip' },
    { icon: 'hourglass', label: 'Remaining', value: remaining, chipVar: '--peach-chip' },
    { icon: 'flame', label: 'Current streak', value: '4 days', chipVar: '--pink-chip' }
  ];

  return (
    <div className="stat-cards">
      {stats.map((s) => (
        <div className="stat-card" key={s.label}>
          <div className="stat-icon" style={{ background: `var(${s.chipVar})` }}>
            <Icon name={s.icon} size={18} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{s.value}</h3>
            <p className="stat-label">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
