import { apiClient } from '@/shared/lib/api-client';
import type { Brand, BrandsListParams } from '../types/brand.types';

export async function fetchBrands(params: BrandsListParams = {}): Promise<{ data: Brand[]; meta: any }> {
  const response = await apiClient.get<Brand[]>('/admin/brands', {
    params: {
      search: params.search,
      page: params.page || 1,
      per_page: params.per_page || 20,
    },
  });
  return {
    data: response.data,
    meta: (response as any).meta,
  };
}

export async function fetchAllBrands(): Promise<Brand[]> {
  const response = await apiClient.get<Brand[]>('/admin/brands', { params: { per_page: 100 } });
  return response.data;
}

export async function fetchBrandByUuid(uuid: string): Promise<Brand> {
  const response = await apiClient.get<Brand>(`/admin/brands/${uuid}`);
  return response.data;
}

export async function createBrand(data: any): Promise<Brand> {
  const response = await apiClient.post<Brand>('/admin/brands', data);
  return response.data;
}

export async function updateBrand(uuid: string, data: any): Promise<Brand> {
  const response = await apiClient.put<Brand>(`/admin/brands/${uuid}`, data);
  return response.data;
}

export async function deleteBrand(uuid: string): Promise<void> {
  await apiClient.delete(`/admin/brands/${uuid}`);
}

export async function uploadBrandLogo(file: File): Promise<{ url: string; public_id: string }> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', 'brands');
  
  const response = await apiClient.post<{ url: string; public_id: string }>(
    '/admin/upload/image',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}
