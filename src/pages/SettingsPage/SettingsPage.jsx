import './SettingsPage.css';
import Bubbles from '../../components/Background/Bubbles.jsx';
import Header from '../../components/Header/Header.jsx';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { resetData } from '../../api/users.js';

export default function SettingsPage() {
  const { user, updateSettings } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleReset = async (mode) => {
    const warning = mode === 'demo'
      ? "This replaces everything you've added with the starter example data. Continue?"
      : "This permanently deletes everything you've added - folders, tasks, lists, notes. Continue?";
    if (!window.confirm(warning)) return;

    setResetting(true);
    setResetMessage('');
    try {
      await resetData(mode);
      setResetMessage(mode === 'demo' ? 'Reset to the starter example data. Refresh the page to see it.' : 'Everything cleared. Refresh the page to see your clean slate.');
    } catch (err) {
      setResetMessage(`Could not reset: ${err.message}`);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="settings-page">
      <Bubbles />
      <Header title="Settings" subtitle="Manage your account, appearance, notifications, security, and data." />

      <div className="settings-content">
        <div className="settings-card">
          <h2>Account</h2>
          <div className="settings-row">
            <span>Login ID</span>
            <span className="settings-muted">{user?.email || '—'}</span>
          </div>
          <p className="settings-note">Your display name (used in greetings) is separate from this login ID.</p>
        </div>

        <div className="settings-card">
          <h2>Appearance</h2>
          <div className="settings-row">
            <span>Dark mode</span>
            <button className="toggle-btn" onClick={() => updateSettings({ darkMode: !user?.darkMode })}>
              {user?.darkMode ? 'On' : 'Off'}
            </button>
          </div>
          <div className="settings-row">
            <span>Card style</span>
            <button
              className="toggle-btn"
              onClick={() => updateSettings({ cardStyle: user?.cardStyle === 'glass' ? 'solid' : 'glass' })}
            >
              {user?.cardStyle === 'glass' ? 'Glass' : 'Solid'}
            </button>
          </div>
          <p className="settings-note">Glass makes cards translucent with a soft blur, so the background bubbles show through.</p>
          <div className="settings-row">
            <span>Category color palette</span>
            <span className="settings-muted">Pastel (default)</span>
          </div>
        </div>

        <div className="settings-card">
          <h2>Notifications</h2>
          <div className="settings-row">
            <span>Email reminders</span>
            <span className="settings-muted">Not connected yet</span>
          </div>
        </div>

        <div className="settings-card">
          <h2>Security</h2>
          <div className="settings-row">
            <span>Password vault</span>
            <span className="settings-muted">Basic vault · low-sensitivity logins only</span>
          </div>
        </div>

        <div className="settings-card">
          <h2>Data</h2>
          <div className="settings-row">
            <span>Export my data</span>
            <button className="toggle-btn">Export</button>
          </div>
        </div>

        <div className="settings-card settings-card-danger">
          <h2 className="settings-danger-heading">Danger zone</h2>
          <div className="settings-row">
            <span>Restart with example data</span>
            <button className="toggle-btn" onClick={() => handleReset('demo')} disabled={resetting}>Reset</button>
          </div>
          <div className="settings-row">
            <span>Clear everything (start blank)</span>
            <button className="toggle-btn toggle-btn-danger" onClick={() => handleReset('empty')} disabled={resetting}>Clear</button>
          </div>
          <p className="settings-danger-note">Both of these permanently delete everything you've added - folders, tasks, lists, and notes. You'll be asked to confirm before anything happens.</p>
          {resetMessage && <p className="settings-note">{resetMessage}</p>}
        </div>
      </div>
    </div>
  );
}
