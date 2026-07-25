import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Package,
  Tag,
  FolderTree,
  ShoppingCart,
  MessageCircle,
  Palette,
  Settings,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const adminNavItems: NavItem[] = [
  {
    title: 'لوحة التحكم',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'المنتجات',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'البراندات',
    href: '/admin/brands',
    icon: Tag,
  },
  {
    title: 'الأقسام',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    title: 'الطلبات',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'أرقام الواتساب',
    href: '/admin/whatsapp-numbers',
    icon: MessageCircle,
  },
  {
    title: 'إعدادات الثيم',
    href: '/admin/theme',
    icon: Palette,
  },
  {
    title: 'الإعدادات العامة',
    href: '/admin/settings',
    icon: Settings,
  },
];
