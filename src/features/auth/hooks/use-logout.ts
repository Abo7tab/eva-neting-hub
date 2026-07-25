"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { logoutRequest } from '../api/auth.api';
import { useAuthStore } from '@/shared/stores/auth.store';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => logoutRequest(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('تم تسجيل الخروج');
      router.push('/admin/login');
    },
    onError: () => {
      // Even if API fails, clear local state
      clearAuth();
      queryClient.clear();
      router.push('/admin/login');
    },
  });
}
