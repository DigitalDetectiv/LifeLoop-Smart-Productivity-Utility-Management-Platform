import { useState } from 'react';
import './ProfileMenu.css';
import Icon from '../Icon/Icon.jsx';

export function NotificationBell({ hasUnread = true }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="notif-wrap">
      <div className="icon-btn" onClick={() => setOpen((o) => !o)} role="button" aria-label="Notifications">
        <Icon name="bell" size={17} />
        {hasUnread && <span className="notif-dot" />}
      </div>
      {open && (
        <div className="notif-panel">
          <p className="notif-title">Notifications</p>
          <p className="notif-empty">Real email/push alerts land here once notifications are connected (see Settings).</p>
        </div>
      )}
    </div>
  );
}

export default function ProfileMenu({ userName = 'there', onOpenSettings, onLogout }) {
  const [open, setOpen] = useState(false);
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="profile-wrap">
      <button className="profile-avatar" onClick={() => setOpen((o) => !o)} aria-label="Profile menu">
        {initial}
      </button>
      {open && (
        <div className="profile-panel">
          <p className="profile-name">{userName}</p>
          <div className="profile-item" onClick={() => { setOpen(false); onOpenSettings?.(); }}>
            <Icon name="settings" size={15} /> Settings
          </div>
          <div className="profile-item" onClick={() => { setOpen(false); onLogout?.(); }}>
            <Icon name="logout" size={15} /> Log out
          </div>
        </div>
      )}
    </div>
  );
}
