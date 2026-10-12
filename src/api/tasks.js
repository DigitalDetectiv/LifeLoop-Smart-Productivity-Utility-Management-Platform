import { apiFetch } from './client.js';

export function fetchTodayTasks() {
  return apiFetch('/tasks/today').then((data) => data.tasks);
}

export function fetchTasksForFolder(folderNodeId) {
  return apiFetch(`/tasks?folderNodeId=${folderNodeId}`).then((data) => data.tasks);
}

export function toggleTask(id) {
  return apiFetch(`/tasks/${id}/toggle`, { method: 'POST' }).then((data) => data.task);
}

export function createTask(task) {
  return apiFetch('/tasks', { method: 'POST', body: task }).then((data) => data.task);
}

export function deleteTask(id) {
  return apiFetch(`/tasks/${id}`, { method: 'DELETE' });
}

export function fetchTasksRange(start, end) {
  return apiFetch(`/tasks/range?start=${start}&end=${end}`).then((data) => data.tasksByDate);
}
