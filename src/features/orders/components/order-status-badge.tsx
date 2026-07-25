import { OrderStatus } from '../types/order.types';
import { cn } from '@/shared/lib/utils';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = {
    pending: {
      label: 'قيد الانتظار',
      classes: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    redirected: {
      label: 'تم التحويل',
      classes: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    completed: {
      label: 'مكتمل',
      classes: 'bg-green-100 text-green-800 border-green-200',
    },
    failed: {
      label: 'فشل',
      classes: 'bg-red-100 text-red-800 border-red-200',
    },
  };

  const { label, classes } = config[status] || config.pending;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        classes,
        className
      )}
    >
      {label}
    </span>
  );
}
