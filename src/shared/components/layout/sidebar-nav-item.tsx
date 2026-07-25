"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import type { NavItem } from '@/shared/config/admin-navigation';

interface SidebarNavItemProps {
  item: NavItem;
  onClick?: () => void;
}

export function SidebarNavItem({ item, onClick }: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
        'hover:bg-slate-100 hover:text-slate-900',
        isActive
          ? 'bg-gradient-to-l from-rose-500 to-orange-500 text-white shadow-md shadow-rose-500/20 hover:from-rose-600 hover:to-orange-600 hover:text-white'
          : 'text-slate-600'
      )}
    >
      <Icon className={cn('h-5 w-5', isActive ? 'text-white' : 'text-slate-500')} />
      <span>{item.title}</span>
      {item.badge && (
        <span className={cn(
          'ml-auto text-xs px-2 py-0.5 rounded-full',
          isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
        )}>
          {item.badge}
        </span>
      )}
    </Link>
  );
}
