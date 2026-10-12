import { useEffect, useState } from 'react';
import Panda from '../Panda/Panda.jsx';
import { dailyQuotes } from '../../data/mockData.js';

function greetingWord() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good morning', emoji: '\u2600\uFE0F' };
  if (hour < 18) return { text: 'Good afternoon', emoji: '\uD83C\uDF24\uFE0F' };
  return { text: 'Good evening', emoji: '\uD83C\uDF19' };
}

function formatTime(d) {
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  return `${h}:${m < 10 ? '0' + m : m} ${ampm}`;
}

export default function GreetingOverlay({ userName = 'there', visible, onDismiss }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!visible) return;
    // Spec: auto-dismiss after ~50 seconds.
    const dismissTimer = setTimeout(onDismiss, 50000);
    const clock = setInterval(() => setNow(new Date()), 30000);
    return () => {
      clearTimeout(dismissTimer);
      clearInterval(clock);
    };
  }, [visible, onDismiss]);

  return (
    <div className={`greeting-overlay${visible ? '' : ' hide'}`}>
      <Panda pose="today" size={140} />
      <div className="greeting-title voice">{greetingWord().text}, {userName} {greetingWord().emoji}</div>
      <div className="greeting-time mono">It's {formatTime(now)} now</div>
      <div className="greeting-sub">Let's complete all of it together.</div>
      <div className="greeting-quote voice">"{dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)]}"</div>
      <button className="enter-btn" onClick={onDismiss}>Enter today →</button>
    </div>
  );
}
