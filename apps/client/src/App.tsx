import { Routes, Route } from 'react-router-dom';
import useEvents from './hooks/useEvents';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PageView from './pages/PageView';
import NotFound from './pages/NotFound';
import AuthLayout from './components/Layout/AuthLayout';
import AppLayout from './components/Layout/AppLayout';

function App() {
  useEvents();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthLayout>
            <Signup />
          </AuthLayout>
        }
      />
      <Route
        path="/app"
        element={
          <AppLayout>
            <Dashboard />
          </AppLayout>
        }
      />
      <Route
        path="/app/:pageId"
        element={
          <AppLayout>
            <PageView />
          </AppLayout>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
