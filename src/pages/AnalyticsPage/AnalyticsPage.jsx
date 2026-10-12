import './AnalyticsPage.css';
import Bubbles from '../../components/Background/Bubbles.jsx';
import Header from '../../components/Header/Header.jsx';

export default function AnalyticsPage() {
  return (
    <div className="analytics-page">
      <Bubbles />
      <Header title="Analytics" subtitle="Daily, weekly, and streak/badge tracking once the backend records real completions." />

      <div className="analytics-content">
        <div className="analytics-grid">
          <div className="analytics-card">
            <span className="analytics-label">Today</span>
            <span className="analytics-value">0%</span>
          </div>
          <div className="analytics-card">
            <span className="analytics-label">This week</span>
            <span className="analytics-value">0%</span>
          </div>
          <div className="analytics-card">
            <span className="analytics-label">Current streak</span>
            <span className="analytics-value">0 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
