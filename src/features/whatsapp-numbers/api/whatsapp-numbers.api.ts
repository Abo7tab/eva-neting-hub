import { apiClient } from '@/shared/lib/api-client';
import type { PaginatedResponse, ApiResponse } from '@/shared/types/api.types';
import type { 
  WhatsAppNumber, 
  CreateWhatsAppNumberPayload, 
  UpdateWhatsAppNumberPayload 
} from '../types/whatsapp-number.types';

export async function fetchWhatsAppNumbers(page = 1, perPage = 12): Promise<PaginatedResponse<WhatsAppNumber>> {
  const response = await apiClient.get('/admin/whatsapp-numbers', {
    params: { page, per_page: perPage },
  });
  return {
    success: true,
    message: 'OK',
    data: response.data,
    meta: (response as any).meta,
  };
}

export async function createWhatsAppNumber(payload: CreateWhatsAppNumberPayload): Promise<ApiResponse<WhatsAppNumber>> {
  const response = await apiClient.post('/admin/whatsapp-numbers', payload);
  return response.data;
}

export async function updateWhatsAppNumber({ 
  uuid, 
  payload 
}: { 
  uuid: string; 
  payload: UpdateWhatsAppNumberPayload 
}): Promise<ApiResponse<WhatsAppNumber>> {
  const response = await apiClient.put(`/admin/whatsapp-numbers/${uuid}`, payload);
  return response.data;
}

export async function deleteWhatsAppNumber(uuid: string): Promise<ApiResponse<null>> {
  const response = await apiClient.delete(`/admin/whatsapp-numbers/${uuid}`);
  return response.data;
}
