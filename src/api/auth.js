import { apiFetch, setAccessToken, refreshAccessToken } from './client.js';

export function register({ email, password, displayName }) {
  return apiFetch('/auth/register', { method: 'POST', body: { email, password, displayName } })
    .then((data) => {
      setAccessToken(data.accessToken);
      return data.user;
    });
}

export function login({ email, password }) {
  return apiFetch('/auth/login', { method: 'POST', body: { email, password } })
    .then((data) => {
      setAccessToken(data.accessToken);
      return data.user;
    });
}

export function logout() {
  return apiFetch('/auth/logout', { method: 'POST' }).finally(() => setAccessToken(null));
}

export function fetchMe() {
  return apiFetch('/auth/me').then((data) => data.user);
}

// Called once when the app first loads. There's no access token in memory
// yet (page refreshes wipe it on purpose), but the httpOnly refresh cookie
// might still be valid - if so, this gets a new access token and the
// current user silently, so the person doesn't have to log in again just
// because they reloaded the page.
//
// Any failure here - expired session, network error, the API being slow
// to wake up (e.g. Neon's free tier suspends its compute after idling and
// takes a few seconds to resume on the next query) - should fall back to
// showing the login page, never leave the app stuck on a blank screen.
export async function bootstrapAuth() {
  try {
    await refreshAccessToken();
    const user = await fetchMe();
    return user;
  } catch {
    return null;
  }
}
