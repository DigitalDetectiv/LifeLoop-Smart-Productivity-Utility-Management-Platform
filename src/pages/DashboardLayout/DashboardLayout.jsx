import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import './DashboardLayout.css';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import SecondaryPanel from '../../components/SecondaryPanel/SecondaryPanel.jsx';
import Chatbot from '../../components/Chatbot/Chatbot.jsx';
import QuickAddTask from '../../components/QuickAddTask/QuickAddTask.jsx';
import { fetchCategories } from '../../api/categories.js';
import { fetchTodayTasks, toggleTask as apiToggleTask } from '../../api/tasks.js';
import { useAuth } from '../../context/AuthContext.jsx';

// The backend returns categoryId (a UUID) + colorVar on each task; every
// existing component (CompactTaskList, TaskDetailPanel, DayTimeline,
// RecurringDonut) already expects a `category` slug + `tagSoftVar` -
// matching the shape the old mock data used. Rather than touch every one
// of those components, this adapts the API response into that same shape
// once, right after fetching.
function adaptTask(task, categoryMap) {
  const category = categoryMap[task.categoryId];
  return {
    ...task,
    category: category?.slug ?? 'lists',
    tagSoftVar: category ? category.colorVar.replace('-dot', '-soft') : '--purple-soft'
  };
}

// The persistent app shell: Sidebar + SecondaryPanel + Chatbot + the
// Quick Add modal all stay mounted across every route, and only the
// routed page content (via <Outlet/>) swaps out.
export default function DashboardLayout() {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [secondaryCollapsed, setSecondaryCollapsed] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const loadToday = useCallback((map) => {
    return fetchTodayTasks().then((rawTasks) => {
      setTasks(rawTasks.map((t) => adaptTask(t, map)));
      setTasksLoaded(true);
    });
  }, []);

  useEffect(() => {
    fetchCategories().then((cats) => {
      const map = Object.fromEntries(cats.map((c) => [c.id, c]));
      setCategories(cats);
      setCategoryMap(map);
      return loadToday(map);
    }).catch((err) => {
      console.error('Failed to load dashboard data:', err.message);
      setTasksLoaded(true);
    });
  }, [loadToday]);

  const toggleTask = useCallback((id) => {
    // Optimistic update: flip it immediately, then confirm with the API;
    // roll back if the request fails so the UI never lies about state.
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    apiToggleTask(id).catch(() => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    });
  }, []);

  // Called after Quick Add creates a task - re-pulls today's list so a
  // task scheduled for today shows up immediately without a full reload.
  const handleTaskCreated = (task) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (!task.isRecurring && task.dueDate === todayStr) {
      loadToday(categoryMap);
    }
  };

  const outletContext = {
    tasks,
    tasksLoaded,
    toggleTask,
    categories,
    categoryMap,
    userName: user?.displayName,
    openQuickAdd: () => setQuickAddOpen(true)
  };

  return (
    <div className="app-shell">
      <Sidebar
        userName={user?.displayName}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />

      <SecondaryPanel
        collapsed={secondaryCollapsed}
        onToggleCollapse={() => setSecondaryCollapsed((c) => !c)}
        tasks={tasks}
      />

      <Outlet context={outletContext} />

      <Chatbot />

      {quickAddOpen && (
        <QuickAddTask
          categories={categories}
          onClose={() => setQuickAddOpen(false)}
          onCreated={handleTaskCreated}
        />
      )}
    </div>
  );
}
