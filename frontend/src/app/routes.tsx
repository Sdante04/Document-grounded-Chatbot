import { createBrowserRouter, Navigate } from 'react-router';
import { AppShell } from './components/layout/AppShell';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import KnowledgeBases from './pages/KnowledgeBases';
import Documents from './pages/Documents';
import BotConfig from './pages/BotConfig';
import Chat from './pages/Chat';
import Users from './pages/Users';
import Usage from './pages/Usage';
import Settings from './pages/Settings';

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // In a real app, check auth status here
  return <AppShell>{children}</AppShell>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/app',
    element: <Navigate to="/app/dashboard" replace />,
  },
  {
    path: '/app/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/knowledge-bases',
    element: (
      <ProtectedRoute>
        <KnowledgeBases />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/documents',
    element: (
      <ProtectedRoute>
        <Documents />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/bot-config',
    element: (
      <ProtectedRoute>
        <BotConfig />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/chat',
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/users',
    element: (
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/usage',
    element: (
      <ProtectedRoute>
        <Usage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
