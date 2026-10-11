"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchServerHealth,
  resetHealthCounters,
  clearServerCache,
  ServerHealth,
} from '../api/monitor.api';
import { toast } from 'sonner';

export function useServerHealth(autoRefresh: boolean = false, refreshInterval: number = 30000) {
  return useQuery<ServerHealth>({
    queryKey: ['admin', 'server-health'],
    queryFn: fetchServerHealth,
    staleTime: 15 * 1000,
    refetchInterval: autoRefresh ? refreshInterval : false,
    retry: (failureCount, error: any) => {
      const status = error?.status || error?.response?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
  });
}

export function useResetHealthCounters() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetHealthCounters,
    onSuccess: (data) => {
      toast.success(data?.message || 'تم تصفير العدادات بنجاح');
      queryClient.invalidateQueries({ queryKey: ['admin', 'server-health'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'حدث خطأ أثناء تصفير العدادات');
    },
  });
}

export function useClearServerCache() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearServerCache,
    onSuccess: (data) => {
      toast.success(data?.message || 'تم تفريغ كاش السيرفر بالكامل');
      queryClient.invalidateQueries({ queryKey: ['admin', 'server-health'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'حدث خطأ أثناء تفريغ الكاش');
    },
  });
}
