import './QuoteCard.css';

export default function QuoteCard({ quote }) {
  return (
    <div className="quote-card">
      <p className="voice">"{quote}"</p>
    </div>
  );
}
