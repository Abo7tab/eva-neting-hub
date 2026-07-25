"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/auth.store';

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isAuthenticated) {
        const returnUrl = searchParams.get('returnUrl') || '/admin/dashboard';
        router.replace(returnUrl);
      } else {
        setIsChecking(false);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, router, searchParams]);

  if (isChecking && isAuthenticated) {
    return null; // Brief blank moment before redirect
  }

  return <>{children}</>;
}
