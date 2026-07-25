"use client";

import { useQuery } from '@tanstack/react-query';
import { getCurrentAdmin } from '../api/auth.api';
import { useAuthStore } from '@/shared/stores/auth.store';

export function useCurrentAdmin() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['auth', 'current-admin'],
    queryFn: getCurrentAdmin,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
