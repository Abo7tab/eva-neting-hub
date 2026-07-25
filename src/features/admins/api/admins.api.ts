import { apiClient } from '@/shared/lib/api-client';
import { PaginatedResponse } from '@/shared/types/api.types';
import {
  AdminUser,
  AdminsListParams,
  CreateAdminPayload,
  UpdateAdminPayload,
  ResetPasswordPayload,
} from '../types/admin.types';

export const fetchAdmins = async (params?: AdminsListParams): Promise<PaginatedResponse<AdminUser>> => {
  return apiClient.get('/admin/users', { params });
};

export const fetchAdminById = async (id: number): Promise<{ data: AdminUser }> => {
  return apiClient.get(`/admin/users/${id}`);
};

export const createAdmin = async (data: CreateAdminPayload): Promise<{ data: AdminUser }> => {
  return apiClient.post('/admin/users', data);
};

export const updateAdmin = async (id: number, data: UpdateAdminPayload): Promise<{ data: AdminUser }> => {
  return apiClient.put(`/admin/users/${id}`, data);
};

export const deleteAdminUser = async (id: number): Promise<void> => {
  return apiClient.delete(`/admin/users/${id}`);
};

export const resetAdminPassword = async (id: number, data: ResetPasswordPayload): Promise<void> => {
  return apiClient.patch(`/admin/users/${id}/reset-password`, data);
};
