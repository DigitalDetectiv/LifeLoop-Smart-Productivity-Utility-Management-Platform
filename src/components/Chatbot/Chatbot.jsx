import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import Icon from '../Icon/Icon.jsx';
import Panda from '../Panda/Panda.jsx';
import { sendChatMessage } from '../../api/chat.js';
import { ApiClientError } from '../../api/client.js';

// Real GenAI now (Gemini, via the backend's /api/chat) - it's given the
// user's actual today/tomorrow tasks as context, not just keyword
// matching against a canned list like before.
export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm Loop buddy. Ask me what's left today, for a plan for tomorrow, or just for a bit of motivation." }
  ]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const send = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;

    const history = messages.map((m) => ({ role: m.from === 'bot' ? 'assistant' : 'user', text: m.text }));
    setMessages((prev) => [...prev, { from: 'user', text }]);
    setDraft('');
    setSending(true);

    try {
      const reply = await sendChatMessage(text, history);
      setMessages((prev) => [...prev, { from: 'bot', text: reply }]);
    } catch (err) {
      const friendly = err instanceof ApiClientError
        ? err.message
        : 'Something went wrong reaching the assistant.';
      setMessages((prev) => [...prev, { from: 'bot', text: friendly }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chatbot-root">
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <Panda pose="today" size={28} animated={false} />
            <span>Loop buddy</span>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <Icon name="close" size={16} />
            </button>
          </div>
          <div className="chatbot-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg ${m.from}`}>{m.text}</div>
            ))}
            {sending && <div className="chatbot-msg bot chatbot-msg-typing">Thinking…</div>}
          </div>
          <form className="chatbot-input-row" onSubmit={send}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about today, tomorrow, or for motivation..."
              disabled={sending}
            />
            <button type="submit" aria-label="Send" disabled={sending}><Icon name="send" size={16} /></button>
          </form>
        </div>
      )}

      <button className="chatbot-fab" onClick={() => setOpen((o) => !o)} aria-label="Open chat">
        <Icon name="chat" size={22} />
      </button>
    </div>
  );
}
