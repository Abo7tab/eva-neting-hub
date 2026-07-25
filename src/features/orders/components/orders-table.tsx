'use client';

import { useState } from 'react';
import { OrderLog } from '../types/order.types';
import { Button } from '@/shared/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { EyeIcon, Trash2Icon } from 'lucide-react';
import { ConfirmDeleteDialog } from '@/shared/components/feedback/confirm-delete-dialog';
import { useDeleteOrder } from '../hooks/use-orders';
import { OrderStatusBadge } from './order-status-badge';
import { OrderDetailsModal } from './order-details-modal';
import { toast } from 'sonner';

interface OrdersTableProps {
  orders: OrderLog[];
  isLoading: boolean;
}

export function OrdersTable({ orders, isLoading }: OrdersTableProps) {
  const [orderToDelete, setOrderToDelete] = useState<OrderLog | null>(null);
  const [orderToView, setOrderToView] = useState<OrderLog | null>(null);

  const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder({
    onSuccess: () => setOrderToDelete(null),
  });

  const handleDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete.uuid);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-md bg-white overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableHead>رقم الطلب</TableHead>
              <TableHead>العميل</TableHead>
              <TableHead>الهاتف</TableHead>
              <TableHead>الإجمالي</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.uuid} className="hover:bg-slate-50 transition-colors">
                <TableCell className="font-mono text-sm cursor-pointer hover:text-primary transition-colors" onClick={() => {
                  navigator.clipboard.writeText(order.reference_code);
                  toast.success('تم نسخ رقم الطلب');
                }} title="نسخ رقم الطلب">
                  {order.reference_code}
                </TableCell>
                <TableCell>{order.customer_name || 'غير متوفر'}</TableCell>
                <TableCell 
                  dir="ltr" 
                  className="text-right cursor-pointer hover:text-primary transition-colors"
                  onClick={() => {
                    if (order.customer_phone) {
                      navigator.clipboard.writeText(order.customer_phone);
                      toast.success('تم نسخ رقم الهاتف');
                    }
                  }}
                  title={order.customer_phone ? "نسخ رقم الهاتف" : ""}
                >
                  {order.customer_phone || '-'}
                </TableCell>
                <TableCell className="font-medium">{Number(order.total_price).toLocaleString('ar-EG')} ج.م</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {new Date(order.created_at).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => setOrderToView(order)}
                      title="عرض التفاصيل"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => setOrderToDelete(order)}
                      title="حذف الطلب"
                    >
                      <Trash2Icon className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <OrderDetailsModal
        open={!!orderToView}
        onOpenChange={(open) => !open && setOrderToView(null)}
        order={orderToView}
      />

      <ConfirmDeleteDialog
        open={!!orderToDelete}
        onOpenChange={(open) => !open && setOrderToDelete(null)}
        title="حذف الطلب"
        itemName={`طلب رقم ${orderToDelete?.reference_code}`}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </>
  );
}
