import { apiClient } from '@/shared/lib/api-client';
import type { Product, ProductsListParams, ProductImage } from '../types/product.types';

export async function fetchProducts(params: ProductsListParams = {}): Promise<{ data: Product[]; meta: any }> {
  const response = await apiClient.get<Product[]>('/admin/products', {
    params: {
      search: params.search,
      brand_uuid: params.brand_uuid,
      category_uuid: params.category_uuid,
      is_trending: params.is_trending,
      is_featured: params.is_featured,
      active_status: params.active_status,
      sort_by: params.sort_by || 'newest',
      page: params.page || 1,
      per_page: params.per_page || 12,
    },
  });
  return {
    data: response.data,
    meta: (response as any).meta,
  };
}

export async function fetchProductByUuid(uuid: string): Promise<Product> {
  const response = await apiClient.get<Product>(`/admin/products/${uuid}`);
  return response.data;
}

export async function deleteProduct(uuid: string): Promise<void> {
  await apiClient.delete(`/admin/products/${uuid}`);
}

export async function toggleProductField(
  uuid: string,
  field: 'is_trending' | 'is_featured' | 'active_status',
  value: boolean
): Promise<Product> {
  const response = await apiClient.put<Product>(`/admin/products/${uuid}`, {
    [field]: value,
  });
  return response.data;
}

export async function createProduct(data: any): Promise<Product> {
  const response = await apiClient.post<Product>('/admin/products', data);
  return response.data;
}

export async function updateProduct(uuid: string, data: any): Promise<Product> {
  const response = await apiClient.put<Product>(`/admin/products/${uuid}`, data);
  return response.data;
}

export async function uploadProductCoverImage(file: File): Promise<{ url: string; public_id: string }> {
  const formData = new FormData();
  formData.append('image', file);
  const response = await apiClient.post<{ url: string; public_id: string }>(
    '/admin/upload/image',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
}

// Upload a gallery image for a specific product
export async function uploadProductImage(
  productUuid: string,
  file: File,
  altText?: string
): Promise<ProductImage> {
  // Step 1: Upload file to Cloudinary via generic upload endpoint
  const uploadFormData = new FormData();
  uploadFormData.append('image', file);
  uploadFormData.append('folder', 'products');
  
  const uploadResponse = await apiClient.post<{ url: string; public_id: string }>(
    '/admin/upload/image',
    uploadFormData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  
  const { url, public_id } = uploadResponse.data;
  
  // Step 2: Attach uploaded image URL to the product
  const attachResponse = await apiClient.post<ProductImage>(
    `/admin/products/${productUuid}/images`,
    {
      image_url: url,
      storage_public_id: public_id,
      alt_text: altText || null,
    }
  );
  
  return attachResponse.data;
}

// Delete a gallery image
export async function deleteProductImage(imageUuid: string): Promise<void> {
  await apiClient.delete(`/admin/images/${imageUuid}`);
}

// Reorder gallery images
export async function reorderProductImages(
  productUuid: string,
  imageUuids: string[]
): Promise<void> {
  await apiClient.patch(`/admin/products/${productUuid}/images/reorder`, {
    images: imageUuids.map((uuid, index) => ({ uuid, sort_order: index })),
  });
}

// Update alt text
export async function updateImageAltText(
  imageUuid: string,
  altText: string
): Promise<void> {
  await apiClient.put(`/admin/images/${imageUuid}`, { alt_text: altText });
}
