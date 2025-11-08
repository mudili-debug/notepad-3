import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginLoading, loginError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Navigation is handled in the useAuth hook
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
        Welcome back
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {loginError ? (
          <p className="text-sm text-red-600 dark:text-red-400">
            {typeof loginError === 'string' ? loginError : 'An error occurred'}
          </p>
        ) : null}
        <Button type="submit" className="w-full" loading={loginLoading}>
          Log in
        </Button>
      </form>
      <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
