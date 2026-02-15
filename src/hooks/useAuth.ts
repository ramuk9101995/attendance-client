import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { LoginCredentials, SignupData } from '../types';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
      toast.success(data.message || 'Login successful!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      const errors = error.response?.data?.errors;
      
      if (errors && Array.isArray(errors)) {
        // Show main message
        toast.error(message);
        // Show each validation error
        errors.forEach((err: any) => {
          toast.error(err.message, { duration: 5000 });
        });
      } else {
        toast.error(message);
      }
    },
  });
};

export const useSignup = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: SignupData) => authApi.signup(data),
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
      toast.success(data.message || 'Registration successful!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      const errors = error.response?.data?.errors;
      
      if (errors && Array.isArray(errors)) {
        // Show main message
        toast.error(message);
        // Show each validation error
        errors.forEach((err: any) => {
          toast.error(err.message, { duration: 5000 });
        });
      } else {
        toast.error(message);
      }
    },
  });
};

export const useProfile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };
};