import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../services/attendanceService';
import toast from 'react-hot-toast';

export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notes?: string) => attendanceApi.checkIn(notes),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['todayAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendanceHistory'] });
      toast.success(data.message || 'Checked in successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Check-in failed. Please try again.';
      const errors = error.response?.data?.errors;
      
      if (errors && Array.isArray(errors)) {
        toast.error(message);
        errors.forEach((err: any) => {
          toast.error(err.message, { duration: 5000 });
        });
      } else {
        toast.error(message, { duration: 4000 });
      }
    },
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notes?: string) => attendanceApi.checkOut(notes),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['todayAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendanceHistory'] });
      toast.success(data.message || 'Checked out successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Check-out failed. Please try again.';
      const errors = error.response?.data?.errors;
      
      if (errors && Array.isArray(errors)) {
        toast.error(message);
        errors.forEach((err: any) => {
          toast.error(err.message, { duration: 5000 });
        });
      } else {
        toast.error(message, { duration: 4000 });
      }
    },
  });
};

export const useTodayAttendance = () => {
  return useQuery({
    queryKey: ['todayAttendance'],
    queryFn: attendanceApi.getTodayAttendance,
    refetchInterval: 60000, // Refetch every minute
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
};

export const useAttendanceHistory = (limit: number = 30, offset: number = 0) => {
  return useQuery({
    queryKey: ['attendanceHistory', limit, offset],
    queryFn: () => attendanceApi.getHistory(limit, offset),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};