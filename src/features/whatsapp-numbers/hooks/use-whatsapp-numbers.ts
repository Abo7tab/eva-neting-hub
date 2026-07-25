import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  fetchWhatsAppNumbers, 
  createWhatsAppNumber, 
  updateWhatsAppNumber, 
  deleteWhatsAppNumber 
} from '../api/whatsapp-numbers.api';
import type { WhatsAppNumber } from '../types/whatsapp-number.types';
import type { PaginatedResponse } from '@/shared/types/api.types';

const WHATSAPP_NUMBERS_KEY = 'whatsapp-numbers';

export function useWhatsAppNumbersList(page = 1, perPage = 20) {
  return useQuery({
    queryKey: [WHATSAPP_NUMBERS_KEY, page, perPage],
    queryFn: () => fetchWhatsAppNumbers(page, perPage),
  });
}

export function useCreateWhatsAppNumber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWhatsAppNumber,
    onSuccess: () => {
      toast.success('تمت إضافة رقم الواتساب بنجاح');
      queryClient.invalidateQueries({ queryKey: [WHATSAPP_NUMBERS_KEY] });
    },
    onError: (error: any) => {
      const message = error?.message || 'حدث خطأ أثناء إضافة الرقم';
      toast.error(message);
    },
  });
}

export function useUpdateWhatsAppNumber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWhatsAppNumber,
    onMutate: async ({ uuid, payload }) => {
      // Optimistic update for the switch toggle (is_active)
      if (Object.keys(payload).length === 1 && 'is_active' in payload) {
        await queryClient.cancelQueries({ queryKey: [WHATSAPP_NUMBERS_KEY] });
        const previousNumbers = queryClient.getQueriesData<PaginatedResponse<WhatsAppNumber>>({ queryKey: [WHATSAPP_NUMBERS_KEY] });

        queryClient.setQueriesData({ queryKey: [WHATSAPP_NUMBERS_KEY] }, (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((num: WhatsAppNumber) => 
              num.uuid === uuid ? { ...num, is_active: payload.is_active } : num
            )
          };
        });

        return { previousNumbers };
      }
      return { previousNumbers: undefined };
    },
    onSuccess: (_, variables) => {
      if (Object.keys(variables.payload).length === 1 && 'is_active' in variables.payload) {
        toast.success('تم تحديث الحالة');
      } else {
        toast.success('تم تعديل بيانات الرقم بنجاح');
      }
      queryClient.invalidateQueries({ queryKey: [WHATSAPP_NUMBERS_KEY] });
    },
    onError: (error: any, __, context) => {
      if (context?.previousNumbers) {
        context.previousNumbers.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      const message = error?.message || 'حدث خطأ أثناء التعديل';
      toast.error(message);
    },
  });
}

export function useDeleteWhatsAppNumber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWhatsAppNumber,
    onSuccess: () => {
      toast.success('تم حذف الرقم بنجاح');
      queryClient.invalidateQueries({ queryKey: [WHATSAPP_NUMBERS_KEY] });
    },
    onError: (error: any) => {
      const message = error?.message || 'حدث خطأ أثناء الحذف';
      toast.error(message);
    },
  });
}
