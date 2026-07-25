import { apiClient } from '@/shared/lib/api-client';
import type { Category, CategoriesListParams } from '../types/category.types';

export async function fetchCategories(params: CategoriesListParams = {}): Promise<{ data: Category[]; meta: any }> {
  const response = await apiClient.get<Category[]>('/admin/categories', {
    params: {
      search: params.search,
      page: params.page || 1,
      per_page: params.per_page || 100, // Load more for tree rendering
    },
  });
  return {
    data: response.data,
    meta: (response as any).meta,
  };
}

export async function fetchAllCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/admin/categories', { params: { per_page: 500 } });
  return response.data;
}

export async function fetchCategoryByUuid(uuid: string): Promise<Category> {
  const response = await apiClient.get<Category>(`/admin/categories/${uuid}`);
  return response.data;
}

export async function createCategory(data: any): Promise<Category> {
  const response = await apiClient.post<Category>('/admin/categories', data);
  return response.data;
}

export async function updateCategory(uuid: string, data: any): Promise<Category> {
  const response = await apiClient.put<Category>(`/admin/categories/${uuid}`, data);
  return response.data;
}

export async function deleteCategory(uuid: string): Promise<void> {
  await apiClient.delete(`/admin/categories/${uuid}`);
}

export async function uploadCategoryCover(file: File): Promise<{ url: string; public_id: string }> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', 'categories');
  
  const response = await apiClient.post<{ url: string; public_id: string }>(
    '/admin/upload/image',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}
