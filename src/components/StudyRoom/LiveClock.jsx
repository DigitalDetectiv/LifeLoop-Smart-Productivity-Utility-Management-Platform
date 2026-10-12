import { useState, useEffect } from 'react';
import './LiveClock.css';

export default function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="live-clock">
      <div className="live-clock-time mono">{time}</div>
      <div className="live-clock-date">{date}</div>
    </div>
  );
}
