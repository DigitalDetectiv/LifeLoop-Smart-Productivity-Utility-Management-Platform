import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import Panda from '../../components/Panda/Panda.jsx';
import Bubbles from '../../components/Background/Bubbles.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { ApiClientError } from '../../api/client.js';

// Google login just redirects to the backend, which redirects to Google,
// which redirects back to /auth/callback with a token - see
// pages/AuthCallback for the other half of that flow.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// The backend's login route returns one of these short codes instead of
// a fixed sentence (see config/passport.js) so this page can react
// differently - offer to switch to sign-up for an unknown email, or just
// say "wrong password, try again" when the account is real.
function messageForCode(code, email) {
  switch (code) {
    case 'NO_ACCOUNT':
      return { text: `No account found for ${email}.`, offerSignup: true };
    case 'GOOGLE_ONLY_ACCOUNT':
      return { text: 'This account was created with Google - use "Continue with Google" below instead.', offerSignup: false };
    case 'WRONG_PASSWORD':
      return { text: 'Incorrect password entered, please try again.', offerSignup: false };
    default:
      return { text: code, offerSignup: false };
  }
}

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null); // { text, offerSignup } | null
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ email, password, displayName });
      }
      navigate('/app', { replace: true });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(messageForCode(err.message, email));
      } else {
        setError({ text: 'Something went wrong. Is the API running?', offerSignup: false });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const switchToSignup = () => {
    setMode('register');
    setError(null);
  };

  return (
    <div className="login-page">
      <Bubbles />

      <div className="login-card">
        <Panda pose="welcome" size={92} />
        <h1 className="login-title voice">
          {mode === 'login' ? 'Welcome back' : 'Let\'s get you set up'}
        </h1>
        <p className="login-sub">
          {mode === 'login'
            ? 'Log in to pick up right where you left off.'
            : 'One place for everything — create your account to start.'}
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <label className="field-label" htmlFor="displayName">Name</label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex"
              />
            </>
          )}

          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <label className="field-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && (
            <p className="login-error">
              {error.text}
              {error.offerSignup && (
                <>
                  {' '}
                  <span className="login-error-action" onClick={switchToSignup}>Create an account instead?</span>
                </>
              )}
            </p>
          )}

          <button type="submit" className="primary-btn" disabled={submitting}>
            {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        <div className="divider"><span>or</span></div>

        <a className="google-btn" href={`${API_BASE}/auth/google`}>
          <span className="google-icon">G</span> Continue with Google
        </a>

        <p className="switch-mode">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </span>
        </p>
      </div>
    </div>
  );
}
