"use client";

import { usePathname } from 'next/navigation';
import { adminNavItems } from '@/shared/config/admin-navigation';

export function usePageTitle(): string {
  const pathname = usePathname();
  
  const activeItem = adminNavItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  );
  
  return activeItem?.title || 'لوحة التحكم';
}
