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
          <Image
            src="/logos/main.svg"
            alt="Eva Beauty Hub"
            width={40}
            height={40}
            priority
            className="shrink-0"
          />
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
