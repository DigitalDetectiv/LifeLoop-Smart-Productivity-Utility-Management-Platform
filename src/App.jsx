import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Panda from './components/Panda/Panda.jsx';

import LandingPage from './pages/LandingPage/LandingPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import AuthCallback from './pages/AuthCallback/AuthCallback.jsx';
import DashboardLayout from './pages/DashboardLayout/DashboardLayout.jsx';
import TodayPage from './pages/TodayPage/TodayPage.jsx';
import FinancePage from './pages/FinancePage/FinancePage.jsx';
import HealthPage from './pages/HealthPage/HealthPage.jsx';
import TodosPage from './pages/TodosPage/TodosPage.jsx';
import IdeaVaultPage from './pages/IdeaVaultPage/IdeaVaultPage.jsx';
import CalendarPage from './pages/CalendarPage/CalendarPage.jsx';
import JournalPage from './pages/JournalPage/JournalPage.jsx';
import SettingsPage from './pages/SettingsPage/SettingsPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage/AnalyticsPage.jsx';
import StudyRoomPage from './pages/StudyRoomPage/StudyRoomPage.jsx';

function BootLoading() {
  return (
    <div className="boot-loading">
      <Panda pose="today" size={72} />
      <p>Loading LifeLoop…</p>
    </div>
  );
}

// Guards every route nested inside it: shows a loading state while the
// session check is in flight, sends anonymous visitors to /login, and
// only then renders the actual protected content.
function RequireAuth() {
  const { isAuthenticated, isChecking } = useAuth();
  if (isChecking) return <BootLoading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// The reverse guard: an already-logged-in person hitting the public
// marketing page or /login should land straight in the app, not see the
// pitch/login form again.
function RedirectIfAuthed({ children }) {
  const { isAuthenticated, isChecking } = useAuth();
  if (isChecking) return <BootLoading />;
  if (isAuthenticated) return <Navigate to="/app" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<RedirectIfAuthed><LandingPage /></RedirectIfAuthed>} />
      <Route path="/login" element={<RedirectIfAuthed><LoginPage /></RedirectIfAuthed>} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* The actual app, everything behind auth, lives under /app */}
      <Route path="/app" element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<TodayPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="health" element={<HealthPage />} />
          <Route path="todos" element={<TodosPage />} />
          <Route path="ideas" element={<IdeaVaultPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="journal" element={<JournalPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="study-room" element={<StudyRoomPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
