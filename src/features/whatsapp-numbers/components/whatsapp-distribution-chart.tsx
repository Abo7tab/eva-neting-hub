'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { WhatsAppNumber } from '../types/whatsapp-number.types';

interface WhatsAppDistributionChartProps {
  numbers: WhatsAppNumber[];
}

export function WhatsAppDistributionChart({ numbers }: WhatsAppDistributionChartProps) {
  if (numbers.length < 2) {
    return null;
  }

  const data = numbers.map((n) => ({
    name: n.display_name || n.phone_number,
    order_count: n.order_count,
    is_active: n.is_active,
  }));

  return (
    <div className="bg-card text-card-foreground border rounded-xl p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-semibold">توزيع الطلبات على الأرقام</h3>
      <div className="h-64 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="order_count" radius={[4, 4, 0, 0]} maxBarSize={60}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.is_active ? '#f43f5e' : '#9ca3af'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span>رقم نشط</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <span>رقم غير نشط</span>
        </div>
      </div>
    </div>
  );
}
