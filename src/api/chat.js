import { apiFetch } from './client.js';

export function sendChatMessage(message, history) {
  return apiFetch('/chat', { method: 'POST', body: { message, history } }).then((data) => data.reply);
}
