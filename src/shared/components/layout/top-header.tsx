"use client";

import { Menu, Bell } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { usePageTitle } from '@/shared/hooks/use-page-title';

interface TopHeaderProps {
  onMenuClick: () => void;
}

export function TopHeader({ onMenuClick }: TopHeaderProps) {
  const pageTitle = usePageTitle();

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shrink-0">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Right side (RTL: mobile menu + title) */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden shrink-0"
            aria-label="فتح القائمة"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-slate-900 truncate">
            {pageTitle}
          </h1>
        </div>

        {/* Left side (notifications, etc.) */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" className="relative" disabled aria-label="الإشعارات">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
