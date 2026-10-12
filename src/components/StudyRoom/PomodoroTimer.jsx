import { useState, useEffect, useRef, useCallback } from 'react';
import './PomodoroTimer.css';

const DEFAULT_WORK_MIN = 25;
const DEFAULT_BREAK_MIN = 5;

function format(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function PomodoroTimer() {
  const [workMin, setWorkMin] = useState(DEFAULT_WORK_MIN);
  const [breakMin, setBreakMin] = useState(DEFAULT_BREAK_MIN);
  const [mode, setMode] = useState('work'); // 'work' | 'break'
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_WORK_MIN * 60);
  const [running, setRunning] = useState(false);
  const [cyclesDone, setCyclesDone] = useState(0);
  const intervalRef = useRef(null);

  const switchMode = useCallback((nextMode) => {
    setMode(nextMode);
    setSecondsLeft((nextMode === 'work' ? workMin : breakMin) * 60);
  }, [workMin, breakMin]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (mode === 'work') setCyclesDone((c) => c + 1);
          switchMode(mode === 'work' ? 'break' : 'work');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, mode, switchMode]);

  const reset = () => {
    setRunning(false);
    setMode('work');
    setSecondsLeft(workMin * 60);
    setCyclesDone(0);
  };

  const applyDurations = (newWork, newBreak) => {
    setWorkMin(newWork);
    setBreakMin(newBreak);
    if (!running) setSecondsLeft((mode === 'work' ? newWork : newBreak) * 60);
  };

  const total = (mode === 'work' ? workMin : breakMin) * 60;
  const progress = total ? ((total - secondsLeft) / total) * 100 : 0;

  return (
    <div className="pomodoro-card">
      <div className="pomodoro-mode-label">{mode === 'work' ? 'Focus' : 'Break'}</div>
      <div className="pomodoro-ring" style={{ '--progress': `${progress}%` }}>
        <span className="pomodoro-time mono">{format(secondsLeft)}</span>
      </div>

      <div className="pomodoro-controls">
        <button className="pomodoro-btn pomodoro-btn-primary" onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button className="pomodoro-btn" onClick={reset}>Reset</button>
      </div>

      <div className="pomodoro-settings">
        <label>
          Focus
          <input
            type="number"
            min="1"
            max="90"
            value={workMin}
            onChange={(e) => applyDurations(Number(e.target.value) || 1, breakMin)}
          /> min
        </label>
        <label>
          Break
          <input
            type="number"
            min="1"
            max="30"
            value={breakMin}
            onChange={(e) => applyDurations(workMin, Number(e.target.value) || 1)}
          /> min
        </label>
      </div>

      <p className="pomodoro-cycles">{cyclesDone} focus session{cyclesDone === 1 ? '' : 's'} completed</p>
    </div>
  );
}
