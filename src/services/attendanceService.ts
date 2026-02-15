import apiClient from '../lib/api';
import { Attendance, ApiResponse, PaginatedResponse } from '../types';

export const attendanceApi = {
  checkIn: async (notes?: string): Promise<ApiResponse<{ attendance: Attendance }>> => {
    const response = await apiClient.post<ApiResponse<{ attendance: Attendance }>>(
      '/attendance/checkin',
      { notes }
    );
    return response.data;
  },

  checkOut: async (notes?: string): Promise<ApiResponse<{ attendance: Attendance }>> => {
    const response = await apiClient.post<ApiResponse<{ attendance: Attendance }>>(
      '/attendance/checkout',
      { notes }
    );
    return response.data;
  },

  getTodayAttendance: async (): Promise<ApiResponse<{ attendance: Attendance | null }>> => {
    const response = await apiClient.get<ApiResponse<{ attendance: Attendance | null }>>(
      '/attendance/today'
    );
    return response.data;
  },

  getHistory: async (
    limit: number = 30,
    offset: number = 0
  ): Promise<PaginatedResponse<Attendance>> => {
    const response = await apiClient.get<PaginatedResponse<Attendance>>(
      `/attendance/history?limit=${limit}&offset=${offset}`
    );
    return response.data;
  },
};
