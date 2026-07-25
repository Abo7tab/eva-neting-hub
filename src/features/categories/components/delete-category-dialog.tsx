"use client";

import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import type { Category } from '../types/category.types';
import { useDeleteCategory } from '../hooks/use-categories';

interface DeleteCategoryDialogProps {
  category: Category | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCategoryDialog({
  category,
  isOpen,
  onOpenChange,
}: DeleteCategoryDialogProps) {
  const deleteCategory = useDeleteCategory();

  const handleConfirm = () => {
    if (!category) return;
    deleteCategory.mutate(category.uuid, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            <DialogTitle>حذف القسم</DialogTitle>
          </div>
          <DialogDescription className="text-slate-600">
            هل أنت متأكد من رغبتك في حذف قسم <strong>{category?.name}</strong>؟<br />
            لا يمكن التراجع عن هذا الإجراء وسيتم إزالة القسم نهائياً.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex gap-2 sm:justify-start rtl:sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteCategory.isPending}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteCategory.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteCategory.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
            ) : null}
            تأكيد الحذف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
