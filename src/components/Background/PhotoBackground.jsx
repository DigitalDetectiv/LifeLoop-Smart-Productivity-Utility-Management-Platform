import './PhotoBackground.css';

// Sits behind <Bubbles /> on any page. Pass `src` (an imported image path)
// once you have the background photo ready; until then this renders
// nothing and the plain pastel gradient shows instead.
export default function PhotoBackground({ src }) {
  if (!src) return null;

  return (
    <div className="photo-bg" aria-hidden="true">
      <img src={src} alt="" />
      <div className="photo-bg-wash" />
    </div>
  );
}
