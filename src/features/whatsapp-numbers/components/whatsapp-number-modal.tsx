'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { WhatsAppNumberForm } from './whatsapp-number-form';
import type { WhatsAppNumber, CreateWhatsAppNumberPayload, UpdateWhatsAppNumberPayload } from '../types/whatsapp-number.types';

interface WhatsAppNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: WhatsAppNumber | null;
  onSubmit: (data: CreateWhatsAppNumberPayload | UpdateWhatsAppNumberPayload) => void;
  isSubmitting?: boolean;
}

export function WhatsAppNumberModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isSubmitting,
}: WhatsAppNumberModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="max-w-md w-[95vw]" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'تعديل رقم الواتساب' : 'إضافة رقم واتساب جديد'}
          </DialogTitle>
        </DialogHeader>

        <WhatsAppNumberForm
          initialData={initialData}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
