import apiClient from '../lib/api';
import {
  Task,
  ApiResponse,
  PaginatedResponse,
  CreateTaskData,
  UpdateTaskData,
} from '../types';

export const taskApi = {
  getTasks: async (
    status?: string,
    priority?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<PaginatedResponse<Task>> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const response = await apiClient.get<PaginatedResponse<Task>>(
      `/tasks?${params.toString()}`
    );
    return response.data;
  },

  getTaskById: async (id: string): Promise<ApiResponse<{ task: Task }>> => {
    const response = await apiClient.get<ApiResponse<{ task: Task }>>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: CreateTaskData): Promise<ApiResponse<{ task: Task }>> => {
    const response = await apiClient.post<ApiResponse<{ task: Task }>>('/tasks', data);
    return response.data;
  },

  updateTask: async (
    id: string,
    data: UpdateTaskData
  ): Promise<ApiResponse<{ task: Task }>> => {
    const response = await apiClient.put<ApiResponse<{ task: Task }>>(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string): Promise<ApiResponse<{}>> => {
    const response = await apiClient.delete<ApiResponse<{}>>(`/tasks/${id}`);
    return response.data;
  },
};