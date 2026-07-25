import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchWhatsAppSettings, updateWhatsAppSettings } from '../api/whatsapp-template.api';

export const WA_SETTINGS_QUERY_KEY = ['whatsapp-settings'];

export function useWhatsAppSettings() {
  return useQuery({
    queryKey: WA_SETTINGS_QUERY_KEY,
    queryFn: fetchWhatsAppSettings,
  });
}

export function useUpdateWhatsAppTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: string) => {
      return updateWhatsAppSettings({
        settings: [{ setting_key: 'whatsapp_order_template', setting_value: template }]
      });
    },
    onSuccess: () => {
      toast.success('تم حفظ القالب');
      queryClient.invalidateQueries({ queryKey: WA_SETTINGS_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'حدث خطأ أثناء حفظ القالب');
    },
  });
}

export function useUpdateIncludeImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (includeImages: boolean) => {
      return updateWhatsAppSettings({
        settings: [{ setting_key: 'whatsapp_include_images', setting_value: includeImages ? 'true' : 'false' }]
      });
    },
    onSuccess: () => {
      toast.success('تم تحديث الإعداد');
      queryClient.invalidateQueries({ queryKey: WA_SETTINGS_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'حدث خطأ أثناء تحديث الإعداد');
    },
  });
}
