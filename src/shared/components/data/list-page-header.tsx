"use client";

import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

interface ListPageHeaderProps {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
}

export function ListPageHeader({
  title,
  description,
  actionHref,
  actionLabel = 'إضافة جديد',
  actionIcon,
  onAction,
}: ListPageHeaderProps) {
  const Icon = actionIcon || <Plus className="mr-2 h-4 w-4" />;
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg border border-slate-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      {(actionHref || onAction) && (
        actionHref ? (
          <Link href={actionHref}>
            <Button className="bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition-all hover:shadow-md active:scale-95">
              {Icon}
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button onClick={onAction} className="bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition-all hover:shadow-md active:scale-95">
            {Icon}
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
}
