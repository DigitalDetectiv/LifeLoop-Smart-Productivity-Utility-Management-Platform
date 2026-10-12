import { apiFetch } from './client.js';

export function updateMe(patch) {
  return apiFetch('/users/me', { method: 'PATCH', body: patch }).then((data) => data.user);
}

// mode: 'demo' re-seeds the starter data, 'empty' leaves a clean slate.
export function resetData(mode) {
  return apiFetch('/users/me/reset-data', { method: 'POST', body: { mode } });
}
