import './Bubbles.css';

// Purely decorative, absolutely positioned, pointer-events disabled so it
// never sits in the way of real content. Drop <Bubbles /> into any
// position:relative container that has --main-grad as its background.
export default function Bubbles() {
  return (
    <div className="bubbles-layer" aria-hidden="true">
      <div className="bubble bubble-1" />
      <div className="bubble bubble-2" />
      <div className="bubble bubble-3" />
      <div className="bubble bubble-4" />
      <div className="bubble bubble-5" />
      <div className="bubble bubble-6" />
    </div>
  );
}
