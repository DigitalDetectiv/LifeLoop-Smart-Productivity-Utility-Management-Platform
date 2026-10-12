// Base URL comes from an env var so it's different in dev vs. once you
// deploy (set VITE_API_URL in a .env file - see .env.example).
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Free-tier Postgres (Neon included) can suspend its compute after being
// idle and take several seconds to wake up on the next query. This gives
// that a real chance to succeed without leaving the UI hanging forever if
// something is actually wrong (server down, bad URL, no network).
const REQUEST_TIMEOUT_MS = 15000;

// The access token lives in memory only (not localStorage), per the
// backend README's reasoning: it limits what an XSS bug could steal.
// It's lost on page refresh by design - `bootstrapAuth()` in auth.js
// gets a fresh one back from the refresh cookie on load instead.
let accessToken = null;
export function setAccessToken(token) {
  accessToken = token;
}
export function getAccessToken() {
  return accessToken;
}

function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

let refreshPromise = null;

async function refreshAccessToken() {
  // If a refresh is already in flight (e.g. two requests 401'd at once),
  // share the same promise instead of hitting /refresh twice.
  if (!refreshPromise) {
    refreshPromise = fetchWithTimeout(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('refresh failed');
        const data = await res.json();
        setAccessToken(data.accessToken);
        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// The one function every api/*.js file should call. Adds the auth header,
// sends the refresh cookie, parses JSON, times out instead of hanging
// forever, and - if a request comes back 401 - tries exactly one silent
// refresh + retry before giving up.
export async function apiFetch(path, { method = 'GET', body, isRetry = false } = {}) {
  let res;
  try {
    res = await fetchWithTimeout(`${API_BASE}${path}`, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiClientError(0, "The server is taking too long to respond. It may be waking up from idle - please try again in a few seconds.");
    }
    throw new ApiClientError(0, 'Could not reach the server. Is the API running?');
  }

  if (res.status === 401 && !isRetry) {
    try {
      await refreshAccessToken();
      return apiFetch(path, { method, body, isRetry: true });
    } catch {
      setAccessToken(null);
      throw new ApiClientError(401, 'Login failed. Please try again, or if you’re a new user, please register');
    }
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiClientError(res.status, data.error || 'Something went wrong.');
  }
  return data;
}

export class ApiClientError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export { refreshAccessToken };
