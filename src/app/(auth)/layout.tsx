import { Suspense } from 'react';
import { GuestGuard } from '@/features/auth/components/guest-guard';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <GuestGuard>{children}</GuestGuard>
    </Suspense>
  );
}
