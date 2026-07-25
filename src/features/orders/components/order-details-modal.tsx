'use client';

import { OrderLog } from '../types/order.types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { OrderStatusBadge } from './order-status-badge';
import { CopyIcon, MessageCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useUpdateOrderStatus } from '../hooks/use-orders';

interface OrderDetailsModalProps {
  order: OrderLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsModal({ order, open, onOpenChange }: OrderDetailsModalProps) {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  if (!order) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('تم النسخ بنجاح');
  };

  const handleStatusChange = (newStatus: string | null) => {
    if (!newStatus) return;
    
    updateStatus(
      { uuid: order.uuid, status: newStatus },
      {
        onSuccess: () => {
          toast.success('تم تحديث حالة الطلب بنجاح');
        },
        onError: () => {
          toast.error('حدث خطأ أثناء تحديث حالة الطلب');
        },
      }
    );
  };

  const openWhatsApp = () => {
    const phone = order.assigned_phone_number?.replace(/[^0-9]/g, '') || '';
    const text = encodeURIComponent(order.checkout_message || '');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto overflow-x-hidden p-0">
        {/* ── Header ── */}
        <div className="p-6 pb-4 border-b">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <DialogTitle className="text-xl flex items-center gap-2">
                طلب #{order.reference_code}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleCopy(order.reference_code)}
                  title="نسخ رقم الطلب"
                >
                  <CopyIcon className="w-4 h-4" />
                </Button>
              </DialogTitle>
              <DialogDescription className="mt-1">
                {new Date(order.created_at).toLocaleDateString('ar-EG', {
                  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
                })}
              </DialogDescription>
            </div>
            <OrderStatusBadge status={order.status} className="text-sm px-3 py-1.5" />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* ── Info Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Info */}
            <div className="border rounded-lg p-4 bg-slate-50 space-y-2">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">بيانات العميل</h3>
              <p className="text-sm">
                <span className="text-slate-500 ml-1">الاسم:</span>
                <span className="font-medium">{order.customer_name || 'غير متوفر'}</span>
              </p>
              <div className="text-sm flex items-center gap-2">
                <span className="text-slate-500">الهاتف:</span>
                <span dir="ltr" className="font-medium">{order.customer_phone || 'غير متوفر'}</span>
                {order.customer_phone && (
                  <Button variant="ghost" size="icon-sm" onClick={() => handleCopy(order.customer_phone!)}>
                    <CopyIcon className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* WhatsApp Info */}
            <div className="border rounded-lg p-4 bg-slate-50 space-y-2">
              <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">الواتساب المستلم</h3>
              <div className="text-sm flex items-center gap-2">
                <span className="text-slate-500">الرقم:</span>
                <span dir="ltr" className="font-medium">{order.assigned_phone_number}</span>
                <Button variant="ghost" size="icon-sm" onClick={() => handleCopy(order.assigned_phone_number)}>
                  <CopyIcon className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm">
                <span className="text-slate-500 ml-1">عدد المنتجات:</span>
                <span className="font-medium">{order.items?.length || 0} قطعة</span>
              </p>
            </div>
          </div>

          {/* ── Order Items Table ── */}
          <div>
            <h3 className="font-bold text-slate-700 mb-3">المنتجات المطلوبة</h3>
            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm text-right">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="p-3 font-semibold text-slate-600 text-right">المنتج</th>
                    <th className="p-3 font-semibold text-slate-600 text-center w-20">الكمية</th>
                    <th className="p-3 font-semibold text-slate-600 text-left w-32">السعر</th>
                    <th className="p-3 font-semibold text-slate-600 text-left w-32">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items?.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {item.product_image_snapshot ? (
                            <img
                              src={item.product_image_snapshot}
                              alt={item.product_name_snapshot}
                              className="w-10 h-10 rounded-lg object-cover border flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-200 border flex-shrink-0" />
                          )}
                          <span className="font-medium leading-snug">{item.product_name_snapshot}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center text-slate-700">{item.quantity}×</td>
                      <td className="p-3 text-left text-slate-600">{Number(item.unit_price).toLocaleString('ar-EG')} ج.م</td>
                      <td className="p-3 text-left font-semibold">{Number(item.line_total).toLocaleString('ar-EG')} ج.م</td>
                    </tr>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-400">لا توجد منتجات</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Totals ── */}
          <div className="flex justify-end">
            <div className="w-64 border rounded-lg overflow-hidden">
              <div className="flex justify-between p-3 bg-slate-50 text-sm">
                <span className="text-slate-600">المجموع الفرعي:</span>
                <span>{Number(order.subtotal).toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div className="flex justify-between p-3 border-t bg-white font-bold text-base">
                <span>الإجمالي:</span>
                <span className="text-primary">{Number(order.total_price).toLocaleString('ar-EG')} ج.م</span>
              </div>
            </div>
          </div>

          {/* ── WhatsApp Message Preview ── */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="font-bold text-slate-700">رسالة الواتساب</h3>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(order.checkout_message)}
                >
                  <CopyIcon className="w-4 h-4 ml-1" />
                  نسخ الرسالة
                </Button>
                <Button size="sm" onClick={openWhatsApp} className="bg-green-600 hover:bg-green-700 text-white">
                  <MessageCircleIcon className="w-4 h-4 ml-1" />
                  فتح واتساب
                </Button>
              </div>
            </div>
            <div className="border rounded-lg p-4 bg-slate-50 whitespace-pre-wrap text-sm text-slate-800 leading-relaxed font-mono max-h-40 overflow-y-auto">
              {order.checkout_message || 'لا توجد رسالة'}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <DialogFooter className="px-6 py-4 border-t bg-slate-50 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">تغيير الحالة:</span>
            <div className="w-44">
              <Select
                value={order.status}
                onValueChange={handleStatusChange}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="redirected">تم التحويل</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="failed">فشل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
