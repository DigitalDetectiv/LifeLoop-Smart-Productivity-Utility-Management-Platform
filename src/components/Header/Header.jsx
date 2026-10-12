import './Header.css';

export default function Header({ title, subtitle, rightSlot }) {
  return (
    <header className="page-header">
      <div>
        <h1 className="page-title voice">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {rightSlot && <div className="page-header-actions">{rightSlot}</div>}
    </header>
  );
}
