import { apiClient } from '@/shared/lib/api-client';
import { PaginatedResponse } from '@/shared/types/api.types';
import { OrderLog, OrdersListParams, OrderStats } from '../types/order.types';

export const fetchOrders = async (params?: OrdersListParams): Promise<PaginatedResponse<OrderLog>> => {
  return apiClient.get('/admin/orders', { params });
};

export const fetchOrderStats = async (): Promise<{ data: OrderStats }> => {
  return apiClient.get('/admin/orders/stats');
};

export const fetchOrderById = async (uuid: string): Promise<{ data: OrderLog }> => {
  return apiClient.get(`/admin/orders/${uuid}`);
};

export const updateOrderStatus = async (uuid: string, status: string): Promise<{ data: OrderLog }> => {
  return apiClient.patch(`/admin/orders/${uuid}/status`, { status });
};

export const deleteOrder = async (uuid: string): Promise<void> => {
  return apiClient.delete(`/admin/orders/${uuid}`);
};
