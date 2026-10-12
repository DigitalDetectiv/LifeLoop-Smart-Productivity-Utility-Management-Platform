import './FlipCoin.css';
import Icon from '../Icon/Icon.jsx';

export default function FlipCoin({ done, onToggle, colorVar = '--purple-chip', size = 40 }) {
  return (
    <button
      type="button"
      className={`flip-coin${done ? ' flipped' : ''}`}
      style={{ width: size, height: size }}
      onClick={onToggle}
      aria-pressed={done}
      aria-label={done ? 'Mark as not done' : 'Mark as done'}
    >
      <span className="flip-coin-inner">
        <span className="flip-coin-face flip-coin-front" style={{ background: `var(${colorVar})` }} />
        <span className="flip-coin-face flip-coin-back">
          <Icon name="check" size={Math.round(size * 0.45)} strokeWidth={3} />
        </span>
      </span>
    </button>
  );
}
