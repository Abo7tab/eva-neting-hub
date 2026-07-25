"use client";

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { loginRequest } from '../api/auth.api';
import { useAuthStore } from '@/shared/stores/auth.store';
import type { LoginPayload } from '@/shared/types/auth.types';

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    onSuccess: (data) => {
      setAuth(data.admin, data.token);
      toast.success('تم تسجيل الدخول بنجاح');
      router.push('/admin/dashboard');
    },
    onError: (error: any) => {
      const message = error?.message || 'فشل تسجيل الدخول';
      toast.error(message);
    },
  });
}
