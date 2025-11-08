import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import PageView from '../pages/PageView';
import NotFound from '../pages/NotFound';
import Settings from '../pages/Settings';
import Meetings from '../pages/Meetings';
import NotionAI from '../pages/NotionAI';
import Inbox from '../pages/Inbox';
import Marketplace from '../pages/Marketplace';
import Collaboration from '../pages/Collaboration';
import Trash from '../pages/Trash';
import AuthLayout from '../components/Layout/AuthLayout';
import AppLayout from '../components/Layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: '/signup',
    element: (
      <AuthLayout>
        <Signup />
      </AuthLayout>
    ),
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'meetings',
        element: <Meetings />,
      },
      {
        path: 'ai',
        element: <NotionAI />,
      },
      {
        path: 'inbox',
        element: <Inbox />,
      },
      {
        path: 'trash',
        element: <Trash />,
      },
      {
        path: 'marketplace',
        element: <Marketplace />,
      },
      {
        path: 'collab',
        element: <Collaboration />,
      },
      {
        path: ':pageId',
        element: <PageView />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
