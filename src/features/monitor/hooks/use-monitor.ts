"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchServerHealth, ServerHealth } from '../api/monitor.api';

export function useServerHealth() {
  return useQuery<ServerHealth>({
    queryKey: ['admin', 'server-health'],
    queryFn: fetchServerHealth,
    staleTime: 8 * 1000, // 8 seconds
    refetchInterval: 10 * 1000, // Auto-refresh every 10 seconds
    retry: (failureCount, error: any) => {
      // Don't retry auth errors
      const status = error?.status || error?.response?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 2;
    },
  });
}
