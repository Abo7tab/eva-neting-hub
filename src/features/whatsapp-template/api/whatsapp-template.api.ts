import { apiClient } from '@/shared/lib/api-client';
import type { ApiResponse } from '@/shared/types/api.types';
import type { UpdateWhatsAppSettingPayload, WhatsAppSettings } from '../types/whatsapp-template.types';

export const fetchWhatsAppSettings = async (): Promise<WhatsAppSettings> => {
  const response = await apiClient.get<any[]>('/admin/settings');
  
  const settings = response.data;
  return {
    whatsapp_order_template: settings.find((s: any) => s.setting_key === 'whatsapp_order_template')?.setting_value || "طلب جديد #{reference_code}\nالإجمالي: {total_price}",
    whatsapp_include_images: settings.find((s: any) => s.setting_key === 'whatsapp_include_images')?.setting_value === 'true',
  };
};

export const updateWhatsAppSettings = async (payload: UpdateWhatsAppSettingPayload): Promise<void> => {
  await apiClient.put<ApiResponse<any>>(`/admin/settings/batch`, payload);
};
