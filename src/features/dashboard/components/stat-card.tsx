"use client";

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, ArrowLeft, Info } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  change?: number;
  sparklineData?: number[];
  color?: 'rose' | 'blue' | 'emerald' | 'amber';
  isLoading?: boolean;
  delay?: number;
  href?: string;
}

const colorMap = {
  rose:    { icon: 'text-rose-500',    trend: 'text-rose-600',    chart: '#f43f5e' },
  blue:    { icon: 'text-blue-500',    trend: 'text-blue-600',    chart: '#3b82f6' },
  emerald: { icon: 'text-emerald-500', trend: 'text-emerald-600', chart: '#10b981' },
  amber:   { icon: 'text-amber-500',   trend: 'text-amber-600',   chart: '#f59e0b' },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  sparklineData = [3, 5, 4, 6, 8, 7, 9],  // default sample data
  color = 'rose',
  isLoading = false,
  delay = 0,
  href,
}: StatCardProps) {
  const colors = colorMap[color];
  const chartData = sparklineData.map((v, i) => ({ x: i, y: v }));

  if (isLoading) {
    return (
      <Card className="p-5">
        <Skeleton className="h-4 w-24 mb-4" />
        <Skeleton className="h-8 w-16 mb-4" />
        <Skeleton className="h-10 w-full mb-3" />
        <Skeleton className="h-3 w-20" />
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="p-5 hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer group">
        {/* Header: Icon + Title + Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className={cn('h-4 w-4', colors.icon)} />
            <span className="text-sm text-slate-500 font-medium">{title}</span>
          </div>
          <Info className="h-3.5 w-3.5 text-slate-300" />
        </div>

        {/* Big Number + Trend */}
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-3xl font-bold text-slate-900 tracking-tight">
            {value}
          </span>
          {change !== undefined && (
            <span className={cn(
              'flex items-center gap-0.5 text-xs font-semibold',
              change >= 0 ? 'text-emerald-600' : 'text-red-600'
            )}>
              {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(change)}%
            </span>
          )}
        </div>

        {/* Mini Sparkline */}
        <div className="h-10 -mx-1 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${color}-${delay}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.chart} stopOpacity={0.3}/>
                  <stop offset="100%" stopColor={colors.chart} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="y"
                stroke={colors.chart}
                strokeWidth={2}
                fill={`url(#gradient-${color}-${delay})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Footer link */}
        {href && (
          <div className="flex items-center gap-1 text-xs text-slate-500 group-hover:text-slate-900 transition-colors">
            <span>التفاصيل</span>
            <ArrowLeft className="h-3 w-3" />
          </div>
        )}
      </Card>
    </motion.div>
  );
}
