"use client";

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
import { useDeleteBrand } from '../hooks/use-brands';
import type { Brand } from '../types/brand.types';

interface DeleteBrandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand;
}

export function DeleteBrandDialog({ isOpen, onClose, brand }: DeleteBrandDialogProps) {
  const deleteMutation = useDeleteBrand();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await deleteMutation.mutateAsync(brand.uuid);
      onClose();
    } catch (error) {
      // Error handled by mutation toast
      // But we must close the dialog if the user encountered the 409 error so they can read the toast clearly
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-full">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle>حذف البراند</DialogTitle>
          </div>
          <DialogDescription className="pt-4 text-base">
            هل أنت متأكد من حذف براند <strong>"{brand.name}"</strong>؟
            <br className="mb-2"/>
            هذا الإجراء سيقوم بحذف البراند ولن يظهر في الموقع بعد الآن. 
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={onClose} disabled={deleteMutation.isPending}>
            إلغاء
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="gap-2"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            تأكيد الحذف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
