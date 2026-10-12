import { useState } from 'react';
import '../CategoryPage/CategoryPage.css';
import './JournalPage.css';
import Bubbles from '../../components/Background/Bubbles.jsx';
import Header from '../../components/Header/Header.jsx';
import Icon from '../../components/Icon/Icon.jsx';
import { journalEntries, vaultEntries } from '../../data/mockData.js';

function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

function formatDay(d) {
  return d.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' });
}

// Each box: field key, label, and a pastel color to keep the page feeling
// like the colorful mindfulness-journal reference rather than plain tabs.
const BOXES = [
  { key: 'goal', label: 'Goal of the day', softVar: '--purple-soft', full: true },
  { key: 'feel', label: 'Today I feel', softVar: '--peach-soft' },
  { key: 'want', label: 'Today I want to...', softVar: '--blue-soft' },
  { key: 'habits', label: "Good habits I'm trying", softVar: '--sage-soft' },
  { key: 'improve', label: 'What should I improve', softVar: '--yellow-soft' },
  { key: 'mistakes', label: 'Mistakes', softVar: '--pink-soft' },
  { key: 'joy', label: 'Things that brought me joy', softVar: '--peach-soft' },
  { key: 'grateful', label: "I'm grateful for...", softVar: '--sage-soft' },
  { key: 'thoughts', label: 'My thoughts today', softVar: '--blue-soft' },
  { key: 'tomorrowGoal', label: 'Goal for tomorrow', softVar: '--purple-soft' }
];

function JournalBox({ box, value, onChange }) {
  return (
    <div className={`journal-box${box.full ? ' full' : ''}`} style={{ background: `var(${box.softVar})` }}>
      <span className="journal-box-label">{box.label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder="Write here..." />
    </div>
  );
}

function VaultTab() {
  const [entries] = useState(vaultEntries);
  const [revealedId, setRevealedId] = useState(null);

  return (
    <div className="journal-tab">
      <p className="vault-warning">
        Basic vault for low-sensitivity logins only — not intended for banking or other critical credentials.
      </p>
      {entries.map((v) => (
        <div className="vault-row" key={v.id}>
          <div>
            <p className="vault-label">{v.label}</p>
            <p className="vault-username">{v.username}</p>
          </div>
          <div className="vault-password-area">
            <span className="mono">{revealedId === v.id ? v.password : '••••••••'}</span>
            <button className="ghost-btn" onClick={() => setRevealedId(revealedId === v.id ? null : v.id)}>
              {revealedId === v.id ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function JournalPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showVault, setShowVault] = useState(false);
  const todayKey = dateKey(new Date());
  const key = dateKey(currentDate);

  const [entriesByDate, setEntriesByDate] = useState({ [todayKey]: journalEntries });
  const dayData = entriesByDate[key] ?? {};

  const shiftDay = (delta) => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + delta);
    setCurrentDate(next);
  };

  const setField = (field, value) => {
    setEntriesByDate((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  // Mock streak/wellbeing badges - swap for real computed values once
  // entries persist across real days on the backend.
  const streakDays = Object.keys(entriesByDate).length + 3;

  return (
    <div className="category-page">
      <Bubbles />
      <Header
        title="Journal"
        subtitle="One page per day — write freely, and look back whenever you want."
        rightSlot={<button className="ghost-btn" onClick={() => setShowVault((v) => !v)}>{showVault ? 'Back to journal' : 'Password vault'}</button>}
      />
      <div className="category-scroll">
        {!showVault && (
          <div className="journal-badges">
            <div className="journal-badge">
              <Icon name="bell" size={15} />
              <span><strong>{streakDays} day</strong> journaling streak</span>
            </div>
            <div className="journal-badge journal-badge-alt">
              <Icon name="note" size={15} />
              <span>Journaling &amp; feeling better</span>
            </div>
          </div>
        )}

        {showVault ? (
          <VaultTab />
        ) : (
          <>
            <div className="journal-date-nav">
              <button className="ghost-btn" onClick={() => shiftDay(-1)}><Icon name="chevronLeft" size={14} /></button>
              <span className="journal-date-label voice">{formatDay(currentDate)}</span>
              <button className="ghost-btn journal-next" onClick={() => shiftDay(1)}><Icon name="chevronLeft" size={14} className="flip" /></button>
              {key !== todayKey && <button className="ghost-btn" onClick={() => setCurrentDate(new Date())}>Today</button>}
            </div>

            <div className="journal-grid">
              {BOXES.map((box) => (
                <JournalBox key={box.key} box={box} value={dayData[box.key] ?? ''} onChange={(v) => setField(box.key, v)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
