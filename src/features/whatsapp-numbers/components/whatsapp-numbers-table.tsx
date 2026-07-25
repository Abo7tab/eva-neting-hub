'use client';

import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { Badge } from '@/shared/components/ui/badge';
import type { WhatsAppNumber } from '../types/whatsapp-number.types';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface WhatsAppNumbersTableProps {
  numbers: WhatsAppNumber[];
  onEdit: (number: WhatsAppNumber) => void;
  onDelete: (number: WhatsAppNumber) => void;
  onToggleActive: (uuid: string, currentStatus: boolean) => void;
}

export function WhatsAppNumbersTable({
  numbers,
  onEdit,
  onDelete,
  onToggleActive,
}: WhatsAppNumbersTableProps) {
  return (
    <div className="border rounded-md overflow-x-auto">
      <table className="w-full text-sm text-right">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="p-4 font-medium">#</th>
            <th className="p-4 font-medium">الاسم التعريفي</th>
            <th className="p-4 font-medium">رقم الواتساب</th>
            <th className="p-4 font-medium">الحالة</th>
            <th className="p-4 font-medium">عدد الطلبات</th>
            <th className="p-4 font-medium">آخر تعيين</th>
            <th className="p-4 font-medium">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {numbers.map((number, index) => (
            <tr key={number.uuid} className="hover:bg-muted/50 transition-colors">
              <td className="p-4">{index + 1}</td>
              <td className="p-4">
                {number.display_name ? (
                  <span className="font-medium">{number.display_name}</span>
                ) : (
                  <span className="text-muted-foreground text-xs">بدون اسم</span>
                )}
              </td>
              <td className="p-4" dir="ltr">{number.phone_number}</td>
              <td className="p-4">
                <Switch
                  checked={number.is_active}
                  onCheckedChange={() => onToggleActive(number.uuid, number.is_active)}
                />
              </td>
              <td className="p-4">
                <Badge variant="secondary">{number.order_count}</Badge>
              </td>
              <td className="p-4 text-muted-foreground">
                {number.last_assigned_at
                  ? `منذ ${formatDistanceToNow(new Date(number.last_assigned_at), { locale: ar })}`
                  : 'لم يستخدم بعد'}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(number)}
                    title="تعديل"
                  >
                    <Edit className="w-4 h-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(number)}
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {numbers.length === 0 && (
            <tr>
              <td colSpan={7} className="p-8 text-center text-muted-foreground">
                لا توجد أرقام واتساب. أضف رقمك الأول للبدء.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
