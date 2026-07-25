import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../api/settings.api';
import { BatchUpdateSettingsPayload, SiteSetting } from '../types/settings.types';
import { toast } from 'sonner';

export function useSettings() {
  const queryClient = useQueryClient();

  const query = useQuery<SiteSetting[]>({
    queryKey: ['settings'],
    queryFn: settingsApi.fetchAll,
  });

  const batchUpdateMutation = useMutation({
    mutationFn: (payload: BatchUpdateSettingsPayload) => settingsApi.batchUpdate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('تم الحفظ بنجاح');
    },
    onError: () => {
      toast.error('حدث خطأ أثناء حفظ الإعدادات');
    },
  });

  return {
    settings: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    batchUpdate: batchUpdateMutation.mutate,
    isUpdating: batchUpdateMutation.isPending,
  };
}
