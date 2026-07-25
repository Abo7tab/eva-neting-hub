"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  fetchProducts,
  fetchProductByUuid,
  deleteProduct,
  toggleProductField,
  createProduct,
  updateProduct,
} from '../api/products.api';
import type { ProductsListParams } from '../types/product.types';

export function useProducts(params: ProductsListParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => fetchProducts(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useProduct(uuid: string | null) {
  return useQuery({
    queryKey: ['products', uuid],
    queryFn: () => fetchProductByUuid(uuid!),
    enabled: !!uuid,
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => deleteProduct(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('تم حذف المنتج بنجاح');
    },
    onError: (error: any) => {
      const message = error?.message || 'فشل حذف المنتج';
      toast.error(message);
    },
  });
}

export function useToggleProductField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      uuid,
      field,
      value,
    }: {
      uuid: string;
      field: 'is_trending' | 'is_featured' | 'active_status';
      value: boolean;
    }) => toggleProductField(uuid, field, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('تم تحديث المنتج');
    },
    onError: () => {
      toast.error('فشل تحديث المنتج');
    },
  });
}

export function useCreateProduct() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('تم إضافة المنتج بنجاح');
      router.push('/admin/products');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'فشل إضافة المنتج');
    },
  });
}

export function useUpdateProduct(uuid: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateProduct(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('تم تحديث المنتج بنجاح');
      router.push('/admin/products');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'فشل تحديث المنتج');
    },
  });
}
