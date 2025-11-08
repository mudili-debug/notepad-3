import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await api.get('/auth/me');
      return response.data.user as User;
    },
    retry: false,
    onError: () => {
      // Clear any stale auth data
      localStorage.removeItem('accessToken');
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      queryClient.setQueryData(['auth', 'me'], data.user);
      // Show success notification
      import('react-hot-toast').then(({ toast }) => {
        toast.success('Login successful!');
      });
      // Navigate to dashboard after successful login
      window.location.href = '/app';
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post('/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      queryClient.setQueryData(['auth', 'me'], data.user);
      // Show success notification
      import('react-hot-toast').then(({ toast }) => {
        toast.success('Account created successfully!');
      });
    },
  });

  const logout = () => {
    localStorage.removeItem('accessToken');
    queryClient.clear();
    window.location.href = '/login';
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    loginLoading: loginMutation.isLoading,
    registerLoading: registerMutation.isLoading,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
