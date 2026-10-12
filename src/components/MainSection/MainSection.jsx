import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainSection.css';
import GreetingOverlay from './GreetingOverlay.jsx';
import RecurringDonut from './RecurringDonut.jsx';
import DayTimeline from './DayTimeline.jsx';
import CompactTaskList from './CompactTaskList.jsx';
import TaskDetailPanel from './TaskDetailPanel.jsx';
import BambooRow from '../BambooRow/BambooRow.jsx';
import Bubbles from '../Background/Bubbles.jsx';
import PhotoBackground from '../Background/PhotoBackground.jsx';
import Header from '../Header/Header.jsx';
import StatCards from '../StatCards/StatCards.jsx';
import QuoteCard from '../QuoteCard/QuoteCard.jsx';
import Icon from '../Icon/Icon.jsx';
import ProfileMenu, { NotificationBell } from '../ProfileMenu/ProfileMenu.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { dailyQuotes, homeBackgroundImage } from '../../data/mockData.js';

function formatTime(d) {
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m < 10 ? '0' + m : m} ${ampm}`;
}

export default function MainSection({ tasks, tasksLoaded = true, onToggleTask, userName, onQuickAdd }) {
  const { user, logout, updateSettings } = useAuth();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  // Shows once per page load - a real "seen today" persistence can be
  // layered on later (e.g. a lastSeenDate on the user), this keeps it
  // simple for now since routing already handles most of the "which
  // page am I on" concerns this used to carry.
  const [showGreeting, setShowGreeting] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const fillQuote = dailyQuotes[0];
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

  const handleLogout = () => {
    logout().then(() => navigate('/login', { replace: true }));
  };

  return (
    <div className="main">
      <PhotoBackground src={homeBackgroundImage} />
      <Bubbles />

      <GreetingOverlay visible={showGreeting} onDismiss={() => setShowGreeting(false)} userName={userName} />

      <Header
        title="Today"
        subtitle={`Here's what's happening today · ${formatTime(now)}`}
        rightSlot={(
          <>
            <div className="icon-btn" onClick={() => navigate('/app')} role="button" aria-label="Go home">
              <Icon name="home" size={17} />
            </div>
            <div
              className="icon-btn"
              onClick={() => updateSettings({ darkMode: !user?.darkMode })}
              role="button"
              aria-label="Toggle dark mode"
            >
              {user?.darkMode ? '\u25D2' : '\u25D0'}
            </div>
            <div className="icon-btn" onClick={onQuickAdd} role="button" aria-label="Quick add task">
              <Icon name="plus" size={17} />
            </div>
            <NotificationBell />
            <ProfileMenu userName={userName} onOpenSettings={() => navigate('/app/settings')} onLogout={handleLogout} />
          </>
        )}
      />

      <div className="main-scroll">
        {/* Row 1: stats (secondary, flatter) + quote of the day */}
        <div className="bento-row-1">
          <StatCards tasks={tasks} />
          <QuoteCard quote={fillQuote} />
        </div>

        {/* Row 2: recurring - lighter, secondary treatment */}
        <h2 className="section-heading">Recurring</h2>
        <RecurringDonut tasks={tasks} onToggleTask={onToggleTask} />

        {/* Row 3: Today's tasks - the primary focus of the page */}
        <h2 className="section-heading">Today's tasks</h2>
        {tasksLoaded && <BambooRow tasks={tasks} />}
        {!tasksLoaded ? (
          <p className="tasks-loading">Loading today's tasks…</p>
        ) : (
          <div className="todos-columns">
            <CompactTaskList
              tasks={tasks}
              onToggleDone={onToggleTask}
              onSelect={(id) => setSelectedTaskId((prev) => (prev === id ? null : id))}
              selectedId={selectedTaskId}
            />

            <TaskDetailPanel
              task={selectedTask}
              onClose={() => setSelectedTaskId(null)}
              onToggleDone={onToggleTask}
            />
          </div>
        )}

        {/* Row 4: timeline - lighter, secondary treatment */}
        <h2 className="section-heading">Timeline</h2>
        <DayTimeline tasks={tasks} />
      </div>
    </div>
  );
}
