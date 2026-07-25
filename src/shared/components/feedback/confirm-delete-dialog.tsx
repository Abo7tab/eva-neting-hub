"use client";

import { AlertTriangle } from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  itemName?: string;
  description?: string;
  onConfirm: () => void;
  isPending: boolean;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  itemName,
  description,
  onConfirm,
  isPending,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="pt-2">
            {itemName && (
              <>
                هل أنت متأكد من حذف <strong>{itemName}</strong>؟
                <br />
              </>
            )}
            {description || 'سيتم نقله لسلة المحذوفات ويمكن استرجاعه لاحقاً.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
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
