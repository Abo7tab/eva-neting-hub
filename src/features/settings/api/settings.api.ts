import { apiClient } from '@/shared/lib/api-client';
import { SiteSetting, BatchUpdateSettingsPayload } from '../types/settings.types';

export const settingsApi = {
  fetchAll: async (): Promise<SiteSetting[]> => {
    const response = await apiClient.get('/admin/settings');
    return response.data;
  },

  batchUpdate: async (payload: BatchUpdateSettingsPayload): Promise<void> => {
    await apiClient.put('/admin/settings/batch', payload);
  },
};
