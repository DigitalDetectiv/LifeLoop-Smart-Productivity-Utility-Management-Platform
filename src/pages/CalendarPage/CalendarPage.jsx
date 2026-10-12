import { useMemo, useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import '../CategoryPage/CategoryPage.css';
import './CalendarPage.css';
import Bubbles from '../../components/Background/Bubbles.jsx';
import Header from '../../components/Header/Header.jsx';
import Icon from '../../components/Icon/Icon.jsx';
import { fetchTasksRange } from '../../api/tasks.js';
import { timeStringToHours, formatTime12 } from '../../utils/time.js';

const START_HOUR = 7;
const END_HOUR = 21;
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DEFAULT_DURATION = 1; // hour - tasks don't carry an explicit duration yet

function startOfWeek(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

export default function CalendarPage() {
  const { categoryMap } = useOutletContext();
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [tasksByDate, setTasksByDate] = useState({});
  const [loaded, setLoaded] = useState(false);
  const weekStart = useMemo(() => startOfWeek(anchorDate), [anchorDate]);
  const today = new Date();

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    }),
    [weekStart]
  );

  useEffect(() => {
    setLoaded(false);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    fetchTasksRange(dateKey(weekStart), dateKey(end))
      .then(setTasksByDate)
      .finally(() => setLoaded(true));
  }, [weekStart]);

  const monthLabel = weekStart.toLocaleString('default', { month: 'long', year: 'numeric' });
  const shiftWeek = (delta) => {
    const next = new Date(anchorDate);
    next.setDate(next.getDate() + delta * 7);
    setAnchorDate(next);
  };

  return (
    <div className="category-page">
      <Bubbles />
      <Header
        title="Calendar"
        subtitle={monthLabel}
        rightSlot={(
          <div className="gcal-nav">
            <button className="gcal-today-btn" onClick={() => setAnchorDate(new Date())}>Today</button>
            <div className="gcal-arrow-group">
              <button className="gcal-arrow-btn" onClick={() => shiftWeek(-1)} aria-label="Previous week"><Icon name="chevronLeft" size={15} /></button>
              <button className="gcal-arrow-btn" onClick={() => shiftWeek(1)} aria-label="Next week"><Icon name="chevronLeft" size={15} className="flip" /></button>
            </div>
          </div>
        )}
      />
      <div className="category-scroll">
        {!loaded ? (
          <p className="tasks-loading">Loading…</p>
        ) : (
          <div className="gcal-grid">
            <div className="gcal-corner" />
            {weekDays.map((d) => {
              const isToday = d.toDateString() === today.toDateString();
              return (
                <div className={`gcal-day-head${isToday ? ' today' : ''}`} key={d.toISOString()}>
                  <span className="gcal-weekday">{WEEKDAYS[d.getDay()]}</span>
                  <span className="gcal-daynum">{d.getDate()}</span>
                </div>
              );
            })}

            <div className="gcal-hours">
              {HOURS.map((h) => (
                <div className="gcal-hour-label mono" key={h}>
                  {h % 12 === 0 ? 12 : h % 12}{h < 12 ? 'am' : 'pm'}
                </div>
              ))}
            </div>

            {weekDays.map((d) => {
              const dayTasks = (tasksByDate[dateKey(d)] ?? []).filter((t) => t.time);
              return (
                <div className="gcal-day-col" key={d.toISOString()}>
                  {HOURS.map((h) => <div className="gcal-hour-row" key={h} />)}
                  {dayTasks.map((t) => {
                    const startHour = timeStringToHours(t.time);
                    if (startHour === null) return null;
                    const top = ((startHour - START_HOUR) / (END_HOUR - START_HOUR + 1)) * 100;
                    const height = (DEFAULT_DURATION / (END_HOUR - START_HOUR + 1)) * 100;
                    const category = categoryMap[t.categoryId];
                    const colorVar = category?.colorVar ?? '--purple-dot';
                    const softVar = colorVar.replace('-dot', '-soft');
                    return (
                      <div
                        className="gcal-event"
                        key={t.id}
                        title={`${t.title} · ${formatTime12(t.time)}`}
                        style={{
                          top: `${Math.max(0, top)}%`,
                          height: `${height}%`,
                          background: `var(${softVar})`,
                          borderLeftColor: `var(${colorVar})`
                        }}
                      >
                        {t.title}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
