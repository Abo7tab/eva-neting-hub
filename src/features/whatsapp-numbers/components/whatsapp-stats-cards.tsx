'use client';

import { Hash, Activity, Send, Trophy } from 'lucide-react';
import type { WhatsAppNumber } from '../types/whatsapp-number.types';

interface WhatsAppStatsCardsProps {
  numbers: WhatsAppNumber[];
}

export function WhatsAppStatsCards({ numbers }: WhatsAppStatsCardsProps) {
  const totalCount = numbers.length;
  const activeCount = numbers.filter((n) => n.is_active).length;
  const totalOrders = numbers.reduce((sum, n) => sum + n.order_count, 0);
  
  let mostUsedNumber = 'لا يوجد';
  if (numbers.length > 0) {
    const sorted = [...numbers].sort((a, b) => b.order_count - a.order_count);
    if (sorted[0].order_count > 0) {
      mostUsedNumber = sorted[0].display_name || sorted[0].phone_number;
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Numbers */}
      <div className="bg-card text-card-foreground border rounded-xl p-6 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
          <Hash className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">إجمالي الأرقام</p>
          <p className="text-2xl font-bold">{totalCount}</p>
        </div>
      </div>

      {/* Active Numbers */}
      <div className="bg-card text-card-foreground border rounded-xl p-6 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-green-100 text-green-600 rounded-full">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">الأرقام النشطة</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">{activeCount}</p>
            {activeCount > 0 && (
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Total Orders Distributed */}
      <div className="bg-card text-card-foreground border rounded-xl p-6 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
          <Send className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">إجمالي الطلبات الموزعة</p>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
      </div>

      {/* Most Used Number */}
      <div className="bg-card text-card-foreground border rounded-xl p-6 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">الأكثر استخداماً</p>
          <p className="text-lg font-bold truncate max-w-[150px]" title={mostUsedNumber}>
            {mostUsedNumber}
          </p>
        </div>
      </div>
    </div>
  );
}
