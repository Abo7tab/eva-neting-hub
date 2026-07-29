"use client";

import Image from 'next/image';
import Link from 'next/link';
import { adminNavItems } from '@/shared/config/admin-navigation';
import { SidebarNavItem } from './sidebar-nav-item';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Separator } from '@/shared/components/ui/separator';
import { UserMenu } from './user-menu';

interface SidebarProps {
  onItemClick?: () => void;
}

export function Sidebar({ onItemClick }: SidebarProps) {
  return (
    <div className="flex h-full w-full flex-col">
      {/* Logo Section - CRITICAL: no text wrapping */}
      <div className="px-5 py-5 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
            <span className="text-xl font-black">E</span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold text-slate-900 truncate whitespace-nowrap">
              Eva Beauty Hub
            </h1>
            <p className="text-xs text-slate-500 truncate">لوحة التحكم</p>
          </div>
        </Link>
      </div>

      <Separator />

      {/* Navigation - Scrollable */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {adminNavItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              item={item}
              onClick={onItemClick}
            />
          ))}
        </nav>
      </ScrollArea>

      <Separator />

      {/* User Menu at bottom */}
      <div className="p-3 shrink-0">
        <UserMenu />
      </div>
    </div>
  );
}
