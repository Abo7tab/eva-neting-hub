"use client";

import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import type { Product } from '../types/product.types';

interface DeleteConfirmDialogProps {
  product: Product | null;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export function DeleteConfirmDialog({
  product,
  onConfirm,
  onCancel,
  isPending,
}: DeleteConfirmDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogDescription className="pt-2">
            هل أنت متأكد من حذف المنتج <strong>{product.name}</strong>؟
            <br />
            سيتم نقله لسلة المحذوفات ويمكن استرجاعه لاحقاً.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel} disabled={isPending}>
            إلغاء
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'جاري الحذف...' : 'حذف نهائي'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
