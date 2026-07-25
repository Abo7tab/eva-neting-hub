'use client';

import { useOrderStats } from '../hooks/use-orders';
import { Package, RefreshCcw, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  isLoading: boolean;
  colorClass: string;
}

function StatCard({ title, value, icon, isLoading, colorClass }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        {isLoading ? (
          <div className="h-8 w-16 bg-slate-100 animate-pulse rounded"></div>
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </div>
      <div className={cn("p-3 rounded-full flex items-center justify-center", colorClass)}>
        {icon}
      </div>
    </div>
  );
}

export function OrdersStats() {
  const { data: statsResponse, isLoading } = useOrderStats();
  const stats = statsResponse?.data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="قيد الانتظار"
        value={stats?.pending ?? 0}
        icon={<Package className="h-6 w-6 text-amber-600" />}
        colorClass="bg-amber-100"
        isLoading={isLoading}
      />
      <StatCard
        title="محولة"
        value={stats?.redirected ?? 0}
        icon={<RefreshCcw className="h-6 w-6 text-blue-600" />}
        colorClass="bg-blue-100"
        isLoading={isLoading}
      />
      <StatCard
        title="مكتملة"
        value={stats?.completed ?? 0}
        icon={<CheckCircle className="h-6 w-6 text-emerald-600" />}
        colorClass="bg-emerald-100"
        isLoading={isLoading}
      />
      <StatCard
        title="فاشلة"
        value={stats?.failed ?? 0}
        icon={<XCircle className="h-6 w-6 text-red-600" />}
        colorClass="bg-red-100"
        isLoading={isLoading}
      />
    </div>
  );
}
