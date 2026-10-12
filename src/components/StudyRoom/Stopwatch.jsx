import { useState, useRef, useEffect } from 'react';
import './Stopwatch.css';

function formatMs(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  const cs = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
  return `${m}:${s}.${cs}`;
}

export default function Stopwatch() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now() - elapsedMs;
    const tick = () => {
      setElapsedMs(performance.now() - startRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const reset = () => {
    setRunning(false);
    setElapsedMs(0);
    setLaps([]);
  };

  const addLap = () => setLaps((prev) => [elapsedMs, ...prev]);

  return (
    <div className="stopwatch-card">
      <div className="stopwatch-time mono">{formatMs(elapsedMs)}</div>
      <div className="stopwatch-controls">
        <button className="pomodoro-btn pomodoro-btn-primary" onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button className="pomodoro-btn" onClick={addLap} disabled={!running}>Lap</button>
        <button className="pomodoro-btn" onClick={reset}>Reset</button>
      </div>
      {laps.length > 0 && (
        <div className="stopwatch-laps">
          {laps.map((lap, i) => (
            <div className="stopwatch-lap-row" key={i}>
              <span>Lap {laps.length - i}</span>
              <span className="mono">{formatMs(lap)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
