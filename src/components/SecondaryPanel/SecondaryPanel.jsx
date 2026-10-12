import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SecondaryPanel.css';
import PandaWidget from './PandaWidget.jsx';
import Icon from '../Icon/Icon.jsx';
import useResizableWidth from '../../hooks/useResizableWidth.js';
import { permanentQuotes } from '../../data/mockData.js';

// 'today' and 'analytics' are real routes. 'tomorrow'/'week' don't have
// built pages yet - they're shown so the layout matches the original
// spec, but only log a note for now rather than pretending to navigate
// somewhere that doesn't exist.
const VIEWS = [
  { id: 'today', label: 'Today', path: '/app' },
  { id: 'tomorrow', label: 'Tomorrow', path: null },
  { id: 'week', label: '7 days', path: null },
  { id: 'analytics', label: 'Analytics', path: '/app/analytics' }
];

export default function SecondaryPanel({ collapsed, onToggleCollapse, tasks = [] }) {
  const [quoteIndex] = useState(() => Math.floor(Math.random() * permanentQuotes.length));
  const { width, startDrag } = useResizableWidth(230, { min: 190, max: 380 });
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={`secondary${collapsed ? ' collapsed' : ''}`} style={collapsed ? undefined : { width }}>
      <button className="collapse-arrow" onClick={onToggleCollapse} aria-label="Toggle panel">
        <Icon name="chevronLeft" size={15} className={collapsed ? 'flip' : undefined} />
      </button>
      {!collapsed && <div className="resize-handle" onMouseDown={startDrag} />}

      <div className="sec-inner">
        <div className="view-tabs">
          {VIEWS.map((v) => (
            <div
              key={v.id}
              className={`view-tab${location.pathname === v.path ? ' active' : ''}${!v.path ? ' view-tab-soon' : ''}`}
              onClick={() => v.path && navigate(v.path)}
              title={v.path ? undefined : 'Coming soon'}
            >
              {v.label}
            </div>
          ))}
        </div>

        <PandaWidget tasks={tasks} />

        <div className="quote-box voice">"{permanentQuotes[quoteIndex]}"</div>
      </div>
    </div>
  );
}
