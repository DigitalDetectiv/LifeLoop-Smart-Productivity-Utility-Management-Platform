import './PandaWidget.css';
import Panda from '../Panda/Panda.jsx';

function thoughtFor(remaining) {
  if (remaining === 0) return "That's everything — I'm going to sleep.";
  if (remaining === 1) return 'One more to go!';
  return `I have ${remaining} things to do first.`;
}

export default function PandaWidget({ tasks }) {
  const remaining = tasks.filter((t) => !t.done).length;
  const pose = remaining === 0 ? 'sleepy' : 'today';

  return (
    <div className="panda-card">
      <div className="thought-bubble voice">{thoughtFor(remaining)}</div>

      <div className="panda-stage">
        <svg className="panda-sparkle sparkle-1" width="10" height="10" viewBox="0 0 10 10">
          <path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8 Z" fill="var(--yellow-dot)" />
        </svg>
        <svg className="panda-sparkle sparkle-2" width="7" height="7" viewBox="0 0 10 10">
          <path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8 Z" fill="var(--pink-dot)" />
        </svg>
        <svg className="panda-sparkle sparkle-3" width="6" height="6" viewBox="0 0 10 10">
          <path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8 Z" fill="var(--purple-dot)" />
        </svg>
        <Panda pose={pose} size={88} />
      </div>

      <div className="grove">
        {tasks.map((t, i) => (
          <div
            key={t.id}
            className={`stalk${t.done ? ' done' : ''}`}
            style={{ height: t.done ? '8px' : `${26 + i * 5}px` }}
          />
        ))}
      </div>
    </div>
  );
}
