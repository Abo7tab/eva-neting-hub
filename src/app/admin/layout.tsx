import { Suspense } from 'react';
import { AuthGuard } from '@/features/auth/components/auth-guard';
import { AdminShell } from '@/shared/components/layout/admin-shell';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-slate-500">جاري التحميل...</div>
        </div>
      }
    >
      <AuthGuard>
        <AdminShell>{children}</AdminShell>
      </AuthGuard>
    </Suspense>
  );
}
