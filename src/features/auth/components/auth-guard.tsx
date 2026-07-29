"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentAdmin } from "../hooks/use-current-admin";
import { useAuthStore } from "@/shared/stores/auth.store";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [hasHydrated, setHasHydrated] = useState(false);
  const { isLoading, isError } = useCurrentAdmin();

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => setHasHydrated(true));
    const timeoutId = window.setTimeout(() => {
      setHasHydrated(useAuthStore.persist.hasHydrated());
    }, 0);

    return () => {
      unsubscribe();
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    const returnUrl = pathname !== "/admin/login" ? `?returnUrl=${pathname}` : "";

    if (!isAuthenticated) {
      router.replace(`/admin/login${returnUrl}`);
      return;
    }

    if (isError) {
      clearAuth();
      router.replace(`/admin/login${returnUrl}`);
    }
  }, [clearAuth, hasHydrated, isAuthenticated, isError, pathname, router]);

  if (!hasHydrated || !isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-500 text-sm">جاري التحقق...</div>
      </div>
    );
  }

  if (isError) return null;

  return <>{children}</>;
}
