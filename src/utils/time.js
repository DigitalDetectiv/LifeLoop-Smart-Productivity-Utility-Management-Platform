// Backend task times come back as Postgres TIME values, serialized as
// 24-hour strings like "07:30:00" or "09:00". Every place in the app that
// shows a task's time should go through formatTime12 so it reads "7:30
// AM" instead of the raw database string running straight into the task
// title (e.g. "07:30:00Morning stretch").

export function formatTime12(timeStr) {
  if (!timeStr) return '';
  const [hStr, mStr] = String(timeStr).split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10) || 0;
  if (Number.isNaN(h)) return '';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m < 10 ? '0' + m : m} ${ampm}`;
}

// Decimal hours (e.g. "07:30:00" -> 7.5) for positioning on the Timeline.
export function timeStringToHours(timeStr) {
  if (!timeStr) return null;
  const [hStr, mStr] = String(timeStr).split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10) || 0;
  if (Number.isNaN(h)) return null;
  return h + m / 60;
}
