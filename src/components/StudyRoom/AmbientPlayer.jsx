import { useState, useRef, useEffect } from 'react';
import './AmbientPlayer.css';
import Icon from '../Icon/Icon.jsx';

// Procedural noise needs no audio file at all - generated once into a
// looping buffer via the Web Audio API. The algorithms are standard,
// well-known DSP techniques (not copyrighted content).
function fillWhiteNoise(data) {
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
}

function fillPinkNoise(data) {
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;
    data[i] = pink * 0.11;
  }
}

function fillBrownNoise(data) {
  let lastOut = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5;
  }
}

// Rain/birdsong are left as file slots - drop your own royalty-free
// recordings at these paths (under /public/sounds/) and they'll just
// work; until then, selecting one shows a friendly "add the file" note
// instead of silently failing.
const TRACKS = [
  { id: 'white', label: 'White noise', kind: 'noise', fill: fillWhiteNoise },
  { id: 'pink', label: 'Pink noise', kind: 'noise', fill: fillPinkNoise },
  { id: 'brown', label: 'Brown noise', kind: 'noise', fill: fillBrownNoise },
  { id: 'rain', label: 'Rain', kind: 'file', src: '/sounds/rain.mp3' },
  { id: 'birds', label: 'Birdsong', kind: 'file', src: '/sounds/birds.mp3' }
];

export default function AmbientPlayer() {
  const [trackId, setTrackId] = useState('white');
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [fileMissing, setFileMissing] = useState(false);

  const ctxRef = useRef(null);
  const gainRef = useRef(null);
  const sourceRef = useRef(null);
  const audioElRef = useRef(null);

  const getContext = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      gainRef.current = ctxRef.current.createGain();
      gainRef.current.gain.value = volume;
      gainRef.current.connect(ctxRef.current.destination);
    }
    return ctxRef.current;
  };

  const stopCurrent = () => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch { /* already stopped */ }
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current = null;
    }
  };

  const playTrack = (track) => {
    setFileMissing(false);
    const ctx = getContext();

    if (track.kind === 'noise') {
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      track.fill(buffer.getChannelData(0));
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gainRef.current);
      source.start();
      sourceRef.current = source;
    } else {
      const audio = new Audio(track.src);
      audio.loop = true;
      audio.volume = volume;
      audio.play().catch(() => setFileMissing(true));
      audio.onerror = () => setFileMissing(true);
      audioElRef.current = audio;
    }
  };

  const togglePlay = () => {
    if (playing) {
      stopCurrent();
      setPlaying(false);
      return;
    }
    const track = TRACKS.find((t) => t.id === trackId);
    playTrack(track);
    setPlaying(true);
  };

  const selectTrack = (id) => {
    setTrackId(id);
    if (playing) {
      stopCurrent();
      playTrack(TRACKS.find((t) => t.id === id));
    }
  };

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume;
    if (audioElRef.current) audioElRef.current.volume = volume;
  }, [volume]);

  useEffect(() => () => stopCurrent(), []);

  return (
    <div className="ambient-card">
      <h3 className="ambient-title">Ambient sound</h3>
      <div className="ambient-track-list">
        {TRACKS.map((t) => (
          <button
            key={t.id}
            className={`ambient-track-btn${trackId === t.id ? ' active' : ''}`}
            onClick={() => selectTrack(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {fileMissing && (
        <p className="ambient-missing-note">
          Add an audio file at <code>public/sounds/{trackId}.mp3</code> to enable this track.
        </p>
      )}

      <div className="ambient-controls">
        <button className="ambient-play-btn" onClick={togglePlay}>
          <Icon name={playing ? 'close' : 'plus'} size={16} />
          {playing ? 'Stop' : 'Play'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume"
        />
      </div>
    </div>
  );
}
