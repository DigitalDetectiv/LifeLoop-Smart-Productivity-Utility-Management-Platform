import { useState } from 'react';
import './QuickAddTask.css';
import Icon from '../Icon/Icon.jsx';
import ScheduleFields, { emptySchedule, scheduleToPayload, isScheduleValid } from '../ScheduleFields/ScheduleFields.jsx';
import { createTask } from '../../api/tasks.js';

const COLOR_OPTIONS = [
  { var: '--peach-dot', name: 'Peach' },
  { var: '--sage-dot', name: 'Sage' },
  { var: '--purple-dot', name: 'Purple' },
  { var: '--blue-dot', name: 'Blue' },
  { var: '--pink-dot', name: 'Pink' },
  { var: '--yellow-dot', name: 'Yellow' }
];

// A three-step, very-visible way to add a task from anywhere: which
// category it belongs to, what color to tag it, then the title + when.
// The task attaches directly to the category (no folder needed) - the
// schema supports that already (folder_node_id is nullable).
export default function QuickAddTask({ categories, onClose, onCreated }) {
  const [step, setStep] = useState(1);
  const [categoryId, setCategoryId] = useState(null);
  const [colorVar, setColorVar] = useState(COLOR_OPTIONS[0].var);
  const [title, setTitle] = useState('');
  const [schedule, setSchedule] = useState(emptySchedule());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const pickCategory = (cat) => {
    setCategoryId(cat.id);
    setColorVar(cat.colorVar || COLOR_OPTIONS[0].var);
    setStep(2);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !isScheduleValid(schedule)) return;
    setSubmitting(true);
    setError('');
    try {
      const task = await createTask({ categoryId, title: title.trim(), ...scheduleToPayload(schedule) });
      onCreated?.(task);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="quickadd-overlay" onClick={onClose}>
      <div className="quickadd-card" onClick={(e) => e.stopPropagation()}>
        <button className="quickadd-close" onClick={onClose} aria-label="Close"><Icon name="close" size={16} /></button>
        <h2 className="voice">Add a task</h2>

        {step === 1 && (
          <>
            <p className="quickadd-step-label">Where does this belong?</p>
            <div className="quickadd-category-grid">
              {categories.map((cat) => (
                <button key={cat.id} className="quickadd-category-btn" onClick={() => pickCategory(cat)}>
                  <span className="dot" style={{ background: `var(${cat.colorVar})` }} />
                  {cat.name}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="quickadd-step-label">Pick a color for this task</p>
            <div className="quickadd-color-grid">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.var}
                  className={`quickadd-color-swatch${colorVar === c.var ? ' active' : ''}`}
                  style={{ background: `var(${c.var})` }}
                  onClick={() => setColorVar(c.var)}
                  aria-label={c.name}
                />
              ))}
            </div>
            <div className="quickadd-step-actions">
              <button type="button" className="ghost-btn" onClick={() => setStep(1)}>Back</button>
              <button type="button" className="landing-primary-btn" onClick={() => setStep(3)}>Next</button>
            </div>
          </>
        )}

        {step === 3 && (
          <form onSubmit={submit} className="quickadd-form">
            <label className="field-label" htmlFor="qa-title">What's the task?</label>
            <input id="qa-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Call the dentist" autoFocus />

            <p className="quickadd-step-label" style={{ marginTop: 14 }}>When?</p>
            <ScheduleFields value={schedule} onChange={setSchedule} />

            {error && <p className="login-error">{error}</p>}

            <div className="quickadd-step-actions">
              <button type="button" className="ghost-btn" onClick={() => setStep(2)}>Back</button>
              <button type="submit" className="landing-primary-btn" disabled={submitting}>
                {submitting ? 'Adding…' : 'Add task'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
