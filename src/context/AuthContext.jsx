import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { bootstrapAuth, login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth.js';
import { updateMe as apiUpdateMe } from '../api/users.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('checking'); // 'checking' | 'authed' | 'anon'

  useEffect(() => {
    // Guards against React StrictMode's double-effect-invocation in dev
    // firing this twice and racing two refresh-token rotations against
    // each other (the second would fail since the first already rotated
    // the cookie's token) - only the first real invocation should count.
    let cancelled = false;

    bootstrapAuth().then((restoredUser) => {
      if (cancelled) return;
      setUser(restoredUser);
      setStatus(restoredUser ? 'authed' : 'anon');
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', user?.darkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-card-style', user?.cardStyle || 'solid');
  }, [user]);

  const login = useCallback(async (credentials) => {
    const authedUser = await apiLogin(credentials);
    setUser(authedUser);
    setStatus('authed');
    return authedUser;
  }, []);

  const register = useCallback(async (details) => {
    const authedUser = await apiRegister(details);
    setUser(authedUser);
    setStatus('authed');
    return authedUser;
  }, []);

  // Used by AuthCallback.jsx after a Google OAuth redirect hands back an
  // access token directly, rather than through the normal login form.
  const setSession = useCallback((authedUser) => {
    setUser(authedUser);
    setStatus('authed');
  }, []);

  const logout = useCallback(async () => {
    await apiLogout().catch(() => {});
    setUser(null);
    setStatus('anon');
  }, []);

  const updateSettings = useCallback(async (patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev)); // optimistic
    try {
      const updated = await apiUpdateMe(patch);
      setUser(updated);
    } catch {
      // best-effort; leave the optimistic value in place rather than
      // jarring the UI back for a settings toggle
    }
  }, []);

  const value = {
    user,
    isAuthenticated: status === 'authed',
    isChecking: status === 'checking',
    login,
    register,
    setSession,
    logout,
    updateSettings
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
