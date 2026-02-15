import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../services/taskService';
import { CreateTaskData, UpdateTaskData } from '../types';
import toast from 'react-hot-toast';

export const useTasks = (status?: string, priority?: string, limit?: number, offset?: number) => {
  return useQuery({
    queryKey: ['tasks', status, priority, limit, offset],
    queryFn: () => taskApi.getTasks(status, priority, limit, offset),
    staleTime: 1 * 60 * 1000,
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskApi.getTaskById(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskData) => taskApi.createTask(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(data.message || 'Task created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create task.';
      const errors = error.response?.data?.errors;
      if (errors && Array.isArray(errors)) {
        toast.error(message);
        errors.forEach((err: any) => {
          toast.error(err.message, { duration: 5000 });
        });
      } else {
        toast.error(message);
      }
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
      taskApi.updateTask(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', data.data.task.id] });
      toast.success(data.message || 'Task updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update task.';
      const errors = error.response?.data?.errors;
      if (errors && Array.isArray(errors)) {
        toast.error(message);
        errors.forEach((err: any) => {
          toast.error(err.message, { duration: 5000 });
        });
      } else {
        toast.error(message);
      }
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskApi.deleteTask(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(data.message || 'Task deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete task.';
      const errors = error.response?.data?.errors;
      if (errors && Array.isArray(errors)) {
        toast.error(message);
        errors.forEach((err: any) => {
          toast.error(err.message, { duration: 5000 });
        });
      } else {
        toast.error(message);
      }
    },
  });
};