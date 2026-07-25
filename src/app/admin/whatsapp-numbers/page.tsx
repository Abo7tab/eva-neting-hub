'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ListPageHeader } from '@/shared/components/data/list-page-header';
import { ConfirmDeleteDialog } from '@/shared/components/feedback/confirm-delete-dialog';
import { Skeleton } from '@/shared/components/ui/skeleton';

import {
  useWhatsAppNumbersList,
  useCreateWhatsAppNumber,
  useUpdateWhatsAppNumber,
  useDeleteWhatsAppNumber,
} from '@/features/whatsapp-numbers/hooks/use-whatsapp-numbers';
import { WhatsAppStatsCards } from '@/features/whatsapp-numbers/components/whatsapp-stats-cards';
import { WhatsAppDistributionChart } from '@/features/whatsapp-numbers/components/whatsapp-distribution-chart';
import { WhatsAppNumbersTable } from '@/features/whatsapp-numbers/components/whatsapp-numbers-table';
import { WhatsAppNumberModal } from '@/features/whatsapp-numbers/components/whatsapp-number-modal';
import type { WhatsAppNumber, CreateWhatsAppNumberPayload, UpdateWhatsAppNumberPayload } from '@/features/whatsapp-numbers/types/whatsapp-number.types';
import { toast } from 'sonner';

export default function WhatsAppNumbersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNumber, setEditingNumber] = useState<WhatsAppNumber | null>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingNumber, setDeletingNumber] = useState<WhatsAppNumber | null>(null);

  const { data: numbersResponse, isLoading } = useWhatsAppNumbersList(1, 100); // Fetch all basically for chart & stats
  const createMutation = useCreateWhatsAppNumber();
  const updateMutation = useUpdateWhatsAppNumber();
  const deleteMutation = useDeleteWhatsAppNumber();

  const numbers = numbersResponse?.data || [];

  const handleOpenCreate = () => {
    setEditingNumber(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (number: WhatsAppNumber) => {
    setEditingNumber(number);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (number: WhatsAppNumber) => {
    setDeletingNumber(number);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (payload: CreateWhatsAppNumberPayload | UpdateWhatsAppNumberPayload) => {
    if (editingNumber) {
      updateMutation.mutate(
        { uuid: editingNumber.uuid, payload },
        {
          onSuccess: () => setIsModalOpen(false),
        }
      );
    } else {
      createMutation.mutate(payload as CreateWhatsAppNumberPayload, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleToggleActive = (uuid: string, currentStatus: boolean) => {
    updateMutation.mutate({
      uuid,
      payload: { is_active: !currentStatus },
    });
  };

  const confirmDelete = () => {
    if (deletingNumber) {
      deleteMutation.mutate(deletingNumber.uuid, {
        onSuccess: () => setIsDeleteDialogOpen(false),
        onError: (err: any) => {
          // If 422 last active number, toast is shown inside hook. Keep dialog open? 
          // Actually better to close it if it fails so user can see it. Let's close it here anyway.
          setIsDeleteDialogOpen(false);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <ListPageHeader
        title="أرقام الواتساب"
        description="إدارة أرقام الواتساب وتوزيع الطلبات"
        actionLabel="إضافة رقم جديد"
        actionIcon={<Plus className="w-4 h-4 ml-2" />}
        onAction={handleOpenCreate}
      />

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      ) : (
        <div className="space-y-6">
          <WhatsAppStatsCards numbers={numbers} />
          <WhatsAppDistributionChart numbers={numbers} />
          
          <div className="bg-card text-card-foreground border rounded-xl p-6 shadow-sm overflow-hidden">
            <WhatsAppNumbersTable
              numbers={numbers}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onToggleActive={handleToggleActive}
            />
          </div>
        </div>
      )}

      <WhatsAppNumberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingNumber}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => setIsDeleteDialogOpen(open)}
        onConfirm={confirmDelete}
        title="حذف رقم الواتساب"
        description={`هل أنت متأكد من حذف الرقم ${deletingNumber?.display_name || deletingNumber?.phone_number}؟ لن تتمكن من استعادته.`}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
