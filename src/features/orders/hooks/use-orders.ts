import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, fetchOrderById, updateOrderStatus, deleteOrder, fetchOrderStats } from '../api/orders.api';
import { OrdersListParams } from '../types/order.types';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useDeleteMutation } from '@/shared/hooks/use-delete-mutation';

export const ordersKeys = {
  all: ['orders'] as const,
  lists: () => [...ordersKeys.all, 'list'] as const,
  list: (params: OrdersListParams) => [...ordersKeys.lists(), params] as const,
  details: () => [...ordersKeys.all, 'detail'] as const,
  detail: (uuid: string) => [...ordersKeys.details(), uuid] as const,
  stats: () => [...ordersKeys.all, 'stats'] as const,
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: ordersKeys.stats(),
    queryFn: fetchOrderStats,
  });
};

export const useOrdersList = (params: OrdersListParams) => {
  const debouncedSearch = useDebounce(params.search ?? '', 500);

  const queryParams = {
    ...params,
    search: debouncedSearch || undefined,
  };

  return useQuery({
    queryKey: ordersKeys.list(queryParams),
    queryFn: () => fetchOrders(queryParams),
  });
};

export const useOrderDetails = (uuid: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ordersKeys.detail(uuid),
    queryFn: () => fetchOrderById(uuid),
    enabled: options?.enabled,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, status }: { uuid: string; status: string }) => updateOrderStatus(uuid, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
};

export const useDeleteOrder = (options?: { onSuccess?: () => void }) => {
  return useDeleteMutation({
    mutationFn: deleteOrder,
    queryKey: ordersKeys.all,
    successMessage: 'تم حذف الطلب بنجاح',
    defaultErrorMessage: 'حدث خطأ أثناء حذف الطلب',
    onSuccessCallback: options?.onSuccess,
  });
};
