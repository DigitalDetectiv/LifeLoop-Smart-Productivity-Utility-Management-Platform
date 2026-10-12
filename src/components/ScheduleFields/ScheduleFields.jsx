import './ScheduleFields.css';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function emptySchedule() {
  const today = new Date().toISOString().slice(0, 10);
  return { mode: 'date', date: today, withTime: false, time: '', freq: 'daily', days: [1, 2, 3, 4, 5] };
}

// Converts the schedule UI state into the fields the backend's
// POST /api/tasks expects (see tasks.controller.js createTask).
export function scheduleToPayload(s) {
  const time = s.withTime && s.time ? s.time : null;
  if (s.mode === 'recurring') {
    return {
      isRecurring: true,
      recurrenceRule: s.freq === 'daily' ? { freq: 'daily' } : { freq: 'weekly', days: s.days },
      time
    };
  }
  return { isRecurring: false, dueDate: s.date, time };
}

export function isScheduleValid(s) {
  if (s.mode === 'date') return Boolean(s.date);
  return s.freq === 'daily' || s.days.length > 0;
}

// One-time (a specific date, required) or recurring (daily / chosen
// weekdays). The time is always optional - the checkbox lets someone
// leave it off entirely instead of being forced to pick one.
export default function ScheduleFields({ value, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch });
  const toggleDay = (d) =>
    set({ days: value.days.includes(d) ? value.days.filter((x) => x !== d) : [...value.days, d].sort() });

  return (
    <div className="schedule-fields">
      <div className="schedule-mode">
        <button type="button" className={value.mode === 'date' ? 'active' : ''} onClick={() => set({ mode: 'date' })}>
          Specific date
        </button>
        <button type="button" className={value.mode === 'recurring' ? 'active' : ''} onClick={() => set({ mode: 'recurring' })}>
          Recurring
        </button>
      </div>

      {value.mode === 'date' ? (
        <label className="schedule-row">
          Date <span className="required-dot">*</span>
          <input type="date" value={value.date} onChange={(e) => set({ date: e.target.value })} required />
        </label>
      ) : (
        <div className="schedule-recurring">
          <select value={value.freq} onChange={(e) => set({ freq: e.target.value })}>
            <option value="daily">Every day</option>
            <option value="weekly">On certain days</option>
          </select>
          {value.freq === 'weekly' && (
            <div className="schedule-days">
              {WEEKDAYS.map((label, d) => (
                <button
                  type="button"
                  key={d}
                  className={value.days.includes(d) ? 'active' : ''}
                  onClick={() => toggleDay(d)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="schedule-row">
        <label className="schedule-check">
          <input type="checkbox" checked={value.withTime} onChange={(e) => set({ withTime: e.target.checked })} />
          Add a time
        </label>
        {value.withTime && <input type="time" value={value.time} onChange={(e) => set({ time: e.target.value })} />}
      </div>
    </div>
  );
}
