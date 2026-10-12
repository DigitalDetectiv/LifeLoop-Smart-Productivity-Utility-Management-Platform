import { Link } from 'react-router-dom';
import './LandingPage.css';
import Panda from '../../components/Panda/Panda.jsx';
import Bubbles from '../../components/Background/Bubbles.jsx';
import Icon from '../../components/Icon/Icon.jsx';

const FEATURES = [
  { icon: 'check', title: 'One page for today', text: "See today's tasks, recurring habits, and a live timeline of your day at a glance." },
  { icon: 'folder', title: 'Folders, lists, or notes', text: 'Organize Finance, Health, Todos, and Idea Vault however fits - nested folders, checklists, or a free-form notepad.' },
  { icon: 'note', title: 'A real daily journal', text: 'Goals, gratitude, mistakes, and mindfulness - one page per day, easy to look back on.' },
  { icon: 'flame', title: 'Streaks that mean something', text: 'Recurring habits track real completion history, not just a checkbox that resets and forgets.' },
  { icon: 'chat', title: 'A buddy in your corner', text: 'A friendly assistant for motivation and a quick read on what\'s left today.' },
  { icon: 'bell', title: 'Built to grow with you', text: 'Calendar, analytics, and a basic password vault for the everyday logins that don\'t need a full manager.' }
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    tagline: 'Everything you need to get organized.',
    features: ['Unlimited tasks & folders', 'Daily journal', 'Recurring habits & streaks', 'Basic password vault', 'Light or dark mode'],
    cta: 'Get started free',
    highlight: false
  },
  {
    name: 'Pro',
    price: '$4',
    period: '/month',
    tagline: 'For when you want it all connected.',
    features: ['Everything in Free', 'AI-powered chat assistant', 'Calendar sync', 'Priority support'],
    cta: 'Coming soon',
    highlight: true,
    disabled: true
  }
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <div className="landing-logo">
          <span className="landing-logo-mark">&#8734;</span> LifeLoop
        </div>
        <nav className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="landing-nav-actions">
          <Link to="/login" className="landing-link-btn">Log in</Link>
          <Link to="/login" className="landing-primary-btn">Get started</Link>
        </div>
      </header>

      <section className="landing-hero">
        <Bubbles />
        <div className="landing-hero-content">
          <h1 className="voice">Everything in your life,<br />in one calm place.</h1>
          <p className="landing-hero-sub">
            Todos, finance, health, journaling, and a friendly panda cheering you on -
            LifeLoop brings the scattered parts of your day into one page.
          </p>
          <div className="landing-hero-actions">
            <Link to="/login" className="landing-primary-btn landing-primary-btn-lg">Get started free</Link>
            <a href="#features" className="landing-link-btn landing-link-btn-lg">See what's inside</a>
          </div>
        </div>
        <div className="landing-hero-panda">
          <Panda pose="welcome" size={160} />
        </div>
      </section>

      <section className="landing-features" id="features">
        <div className="landing-section-head">
          <span className="landing-eyebrow">What you'll see</span>
          <h2 className="voice">A page for every part of your day</h2>
        </div>
        <div className="landing-feature-grid">
          {FEATURES.map((f) => (
            <div className="landing-feature-card" key={f.title}>
              <span className="landing-feature-icon"><Icon name={f.icon} size={20} /></span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-pricing" id="pricing">
        <div className="landing-section-head">
          <span className="landing-eyebrow">Pricing</span>
          <h2 className="voice">Start free. Upgrade only if you want to.</h2>
        </div>
        <div className="landing-plans">
          {PLANS.map((plan) => (
            <div className={`landing-plan-card${plan.highlight ? ' highlight' : ''}`} key={plan.name}>
              {plan.highlight && <span className="landing-plan-badge">Coming soon</span>}
              <h3>{plan.name}</h3>
              <div className="landing-plan-price">
                <span className="landing-plan-amount">{plan.price}</span>
                <span className="landing-plan-period">{plan.period}</span>
              </div>
              <p className="landing-plan-tagline">{plan.tagline}</p>
              <ul>
                {plan.features.map((f) => (
                  <li key={f}><Icon name="check" size={13} /> {f}</li>
                ))}
              </ul>
              <Link
                to="/login"
                className={plan.highlight ? 'landing-link-btn' : 'landing-primary-btn'}
                aria-disabled={plan.disabled}
                onClick={(e) => plan.disabled && e.preventDefault()}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-logo landing-logo-sm">
          <span className="landing-logo-mark">&#8734;</span> LifeLoop
        </div>
        <p>&copy; {new Date().getFullYear()} LifeLoop. Built one day at a time.</p>
      </footer>
    </div>
  );
}
