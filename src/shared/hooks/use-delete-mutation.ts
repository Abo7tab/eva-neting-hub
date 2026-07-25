"use client";

import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseDeleteMutationOptions {
  mutationFn: (uuid: string) => Promise<void>;
  queryKey: QueryKey;
  successMessage: string;
  defaultErrorMessage: string;
  onSuccessCallback?: () => void;
}

export function useDeleteMutation({
  mutationFn,
  queryKey,
  successMessage,
  defaultErrorMessage,
  onSuccessCallback,
}: UseDeleteMutationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      // Force refetch (not just invalidate)
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.refetchQueries({ queryKey });
      toast.success(successMessage);
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      const backendMessage = 
        error?.message || 
        error?.response?.data?.message;
      toast.error(backendMessage || defaultErrorMessage);
    },
  });
}
