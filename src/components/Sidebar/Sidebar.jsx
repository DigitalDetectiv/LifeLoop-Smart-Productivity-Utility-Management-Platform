import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import Icon from '../Icon/Icon.jsx';
import useResizableWidth from '../../hooks/useResizableWidth.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { categories } from '../../data/mockData.js';

function greetingWord() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good morning', emoji: '\u2600\uFE0F' };
  if (hour < 18) return { text: 'Good afternoon', emoji: '\uD83C\uDF24\uFE0F' };
  return { text: 'Good evening', emoji: '\uD83C\uDF19' };
}

// Maps a category's frontend id (still sourced from mockData.js - see
// TODO in that file about replacing this with the real fetched category
// list) to its real route path.
const CATEGORY_PATHS = {
  lists: '/app/todos',
  finance: '/app/finance',
  health: '/app/health',
  ideas: '/app/ideas',
  calendar: '/app/calendar',
  journal: '/app/journal'
};

export default function Sidebar({ userName = 'Alex', collapsed = false, onToggleCollapse }) {
  const { width, startDrag } = useResizableWidth(260, { min: 200, max: 360 });
  const [query, setQuery] = useState('');
  const filteredCategories = categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout().then(() => navigate('/login', { replace: true }));
  };

  return (
    <div className={`sidebar${collapsed ? ' collapsed' : ''}`} style={collapsed ? undefined : { width }}>
      <div>
        <div className="sidebar-head">
          <div className="sidebar-head-row">
            <NavLink to="/app" className="logo" aria-label="Go home">
              <span className="logo-mark">&#8734;</span>
              <span className="cat-name logo-text">LifeLoop</span>
            </NavLink>
            <button className="collapse-toggle" onClick={onToggleCollapse} aria-label="Toggle sidebar">
              <Icon name="chevronLeft" size={16} className={collapsed ? 'flip' : undefined} />
            </button>
          </div>

          <div className="sidebar-greet voice">{greetingWord().text}, {userName} {greetingWord().emoji}</div>

          <div className="sidebar-search">
            <Icon name="search" size={15} className="sidebar-search-icon" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories..."
            />
          </div>
        </div>

        <div className="cat-list">
          {filteredCategories.map((cat) => (
            <NavLink
              key={cat.id}
              to={CATEGORY_PATHS[cat.id] ?? '/app'}
              className={({ isActive }) => `cat-row${isActive ? ' cat-row-active' : ''}`}
              style={{ '--hover-tint': `var(${cat.softVar})` }}
            >
              <span className="dot" style={{ background: `var(${cat.colorVar})` }} />
              <span className="cat-name">{cat.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="sidebar-bottom">
        {/* Placeholder until a real Study Room URL is provided */}
        <NavLink to="/app/study-room" className={({ isActive }) => `sb-btn${isActive ? ' active' : ''}`}>
          <Icon name="external" size={17} className="sb-icon" />
          <span className="cat-name">Study room</span>
        </NavLink>
        <NavLink to="/app/settings" className={({ isActive }) => `sb-btn${isActive ? ' active' : ''}`}>
          <Icon name="settings" size={17} className="sb-icon" />
          <span className="cat-name">Settings</span>
        </NavLink>
        <div className="sb-btn" onClick={handleLogout}>
          <Icon name="logout" size={17} className="sb-icon" />
          <span className="cat-name">Log out</span>
        </div>
      </div>

      {!collapsed && <div className="resize-handle" onMouseDown={startDrag} />}
    </div>
  );
}
