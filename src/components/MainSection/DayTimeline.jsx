import { timeStringToHours, formatTime12 } from '../../utils/time.js';

const DAY_START = 7; // 7am
const DAY_END = 22; // 10pm
const DAY_SPAN = DAY_END - DAY_START;
const AXIS_LABELS = ['7am', '10am', '1pm', '4pm', '7pm', '10pm'];

function toChipVar(softVar) {
  return softVar ? softVar.replace('-soft', '-chip') : '--purple-chip';
}

function toDotVar(softVar) {
  return softVar ? softVar.replace('-soft', '-dot') : '--purple-dot';
}

export default function DayTimeline({ tasks = [] }) {
  // Real task times come back as 24-hour "HH:MM:SS" strings from the
  // backend - timeStringToHours handles that directly, unlike the old
  // parser here which only understood 12-hour "9:00 am" mock-data strings
  // and silently matched nothing against real data.
  const scheduled = tasks
    .map((t) => ({ ...t, startHour: timeStringToHours(t.time) }))
    .filter((t) => t.startHour !== null)
    .sort((a, b) => a.startHour - b.startHour);

  if (scheduled.length === 0) {
    return (
      <div className="timeline-card timeline-empty">
        <p>Nothing scheduled with a time yet today.</p>
      </div>
    );
  }

  const blendStops = scheduled.map((t) => `var(${t.tagSoftVar})`).join(', ');
  const blendStyle = { background: `linear-gradient(to right, ${blendStops})` };

  return (
    <div className="timeline-card">
      <div className="timeline-strip">
        <div className="timeline-blend" style={blendStyle} />
        {scheduled.map((t) => {
          const clampedStart = Math.max(DAY_START, Math.min(DAY_END - 1.4, t.startHour));
          const leftPct = ((clampedStart - DAY_START) / DAY_SPAN) * 100;
          const widthPct = (1.4 / DAY_SPAN) * 100;
          const dotVar = toDotVar(t.tagSoftVar);
          const chipVar = toChipVar(t.tagSoftVar);

          return (
            <div
              key={t.id}
              className="timeline-box"
              style={{ left: `${leftPct}%`, width: `${widthPct}%`, background: `var(${chipVar})`, borderColor: `var(${dotVar})` }}
              title={`${t.title} · ${formatTime12(t.time)}`}
            >
              {t.title}
            </div>
          );
        })}
      </div>
      <div className="timeline-axis mono">
        {AXIS_LABELS.map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}
