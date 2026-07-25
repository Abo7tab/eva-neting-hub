"use client";

import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel = 'إضافة جديد',
}: EmptyStateProps) {
  return (
    <div className="text-center py-20 bg-white rounded-lg border border-slate-200 border-dashed">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mx-auto mb-6">
        {description}
      </p>
      {actionHref && (
        <Link href={actionHref}>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}
