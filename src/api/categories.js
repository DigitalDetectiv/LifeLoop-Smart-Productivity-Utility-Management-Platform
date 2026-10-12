import { apiFetch } from './client.js';

export function fetchCategories() {
  return apiFetch('/categories').then((data) => data.categories);
}

export function createCategory({ name, colorVar }) {
  return apiFetch('/categories', { method: 'POST', body: { name, colorVar } }).then((data) => data.category);
}
