import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setAccessToken } from '../../api/client.js';
import { fetchMe } from '../../api/auth.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Panda from '../../components/Panda/Panda.jsx';

// The backend's Google OAuth callback redirects here with the access
// token as a query param (the refresh token arrives separately as an
// httpOnly cookie, already set by the time this page loads). This page's
// only job is: grab that token, fetch the user, store both, then get out
// of the way - the token should never stay visible in the URL.
export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('accessToken');
    if (!token) {
      setError('No access token was returned from Google. Please try logging in again.');
      return;
    }

    setAccessToken(token);
    fetchMe()
      .then((user) => {
        setSession(user);
        navigate('/app', { replace: true }); // replace so the token never sits in browser history
      })
      .catch(() => {
        setError('Could not complete Google sign-in. Please try again.');
      });
  }, [searchParams, navigate, setSession]);

  return (
    <div className="boot-loading">
      <Panda pose="today" size={72} />
      <p>{error || 'Finishing sign-in…'}</p>
      {error && <a href="/login">Back to login</a>}
    </div>
  );
}
