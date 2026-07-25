"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/shared/stores/auth.store';
import Image from 'next/image';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for Zustand to hydrate from localStorage
    const timeoutId = setTimeout(() => {
      if (!isAuthenticated) {
        const returnUrl = pathname !== '/admin/login' ? `?returnUrl=${pathname}` : '';
        router.replace(`/admin/login${returnUrl}`);
      } else {
        setIsChecking(false);
      }
    }, 100); // Small delay to allow Zustand hydration

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, router, pathname]);

  if (isChecking || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/logos/main.svg"
            alt="Eva Neting Hub"
            width={80}
            height={80}
            priority
            className="w-auto h-[40px] object-contain"
          />
          <div className="text-slate-500 text-sm">جاري التحقق من الجلسة...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
