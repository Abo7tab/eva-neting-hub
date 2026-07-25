"use client";

import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/shared/stores/auth.store';
import { useLogout } from '@/features/auth/hooks/use-logout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';

export function UserMenu() {
  const admin = useAuthStore((state) => state.admin);
  const logout = useLogout();

  if (!admin) return null;

  const initials = admin.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-gradient-to-br from-rose-500 to-orange-500 text-white text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-right">
            <p className="text-sm font-medium text-slate-900 truncate">
              {admin.name}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {admin.email}
            </p>
          </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-56">
        <DropdownMenuLabel>حسابي</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" disabled>
          <User className="ml-2 h-4 w-4" />
          الملف الشخصي
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={() => logout.mutate()}
        >
          <LogOut className="ml-2 h-4 w-4" />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
