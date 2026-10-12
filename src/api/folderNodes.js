import { apiFetch } from './client.js';

export function fetchFolderNodes(categoryId) {
  return apiFetch(`/folder-nodes?categoryId=${categoryId}`).then((data) => data.nodes);
}

export function createFolderNode({ categoryId, parentId, type, name }) {
  return apiFetch('/folder-nodes', { method: 'POST', body: { categoryId, parentId, type, name } }).then((data) => data.node);
}

export function updateFolderNode(id, patch) {
  return apiFetch(`/folder-nodes/${id}`, { method: 'PATCH', body: patch }).then((data) => data.node);
}

export function deleteFolderNode(id) {
  return apiFetch(`/folder-nodes/${id}`, { method: 'DELETE' });
}
