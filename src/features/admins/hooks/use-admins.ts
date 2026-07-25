import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchAdmins,
  fetchAdminById,
  createAdmin,
  updateAdmin,
  deleteAdminUser,
  resetAdminPassword,
} from '../api/admins.api';
import { AdminsListParams, CreateAdminPayload, UpdateAdminPayload, ResetPasswordPayload } from '../types/admin.types';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useDeleteMutation } from '@/shared/hooks/use-delete-mutation';

export const adminsKeys = {
  all: ['admins'] as const,
  lists: () => [...adminsKeys.all, 'list'] as const,
  list: (params: AdminsListParams) => [...adminsKeys.lists(), params] as const,
  details: () => [...adminsKeys.all, 'detail'] as const,
  detail: (id: number) => [...adminsKeys.details(), id] as const,
};

export const useAdminsList = (params: AdminsListParams) => {
  const debouncedSearch = useDebounce(params.search ?? '', 500);
  const queryParams = { ...params, search: debouncedSearch || undefined };

  return useQuery({
    queryKey: adminsKeys.list(queryParams),
    queryFn: () => fetchAdmins(queryParams),
  });
};

export const useAdminDetails = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: adminsKeys.detail(id),
    queryFn: () => fetchAdminById(id),
    enabled: options?.enabled,
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAdminPayload) => createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminsKeys.all });
      toast.success('تم إنشاء الأدمن بنجاح');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'حدث خطأ أثناء إنشاء الأدمن');
    },
  });
};

export const useUpdateAdmin = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateAdminPayload) => updateAdmin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminsKeys.all });
      toast.success('تم تحديث بيانات الأدمن');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'حدث خطأ أثناء التحديث');
    },
  });
};

export const useDeleteAdmin = (options?: { onSuccess?: () => void }) => {
  return useDeleteMutation({
    mutationFn: (id: string) => deleteAdminUser(Number(id)),
    queryKey: adminsKeys.all,
    successMessage: 'تم حذف الأدمن بنجاح',
    defaultErrorMessage: 'حدث خطأ أثناء الحذف',
    onSuccessCallback: options?.onSuccess,
  });
};

export const useResetAdminPassword = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ResetPasswordPayload }) => resetAdminPassword(id, data),
    onSuccess: () => {
      toast.success('تم إعادة تعيين كلمة المرور بنجاح');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور');
    },
  });
};
