"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchBrands,
  fetchAllBrands,
  fetchBrandByUuid,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../api/brands.api';
import type { BrandsListParams } from '../types/brand.types';
import { useDeleteMutation } from '@/shared/hooks/use-delete-mutation';

export function useBrands(params: BrandsListParams = {}) {
  return useQuery({
    queryKey: ['brands', params],
    queryFn: () => fetchBrands(params),
  });
}

export function useBrandsList() {
  return useQuery({
    queryKey: ['brands', 'all'],
    queryFn: fetchAllBrands,
  });
}

export function useBrand(uuid: string) {
  return useQuery({
    queryKey: ['brands', uuid],
    queryFn: () => fetchBrandByUuid(uuid),
    enabled: !!uuid,
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('تم إنشاء البراند بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'فشل إنشاء البراند');
    },
  });
}

export function useUpdateBrand(uuid: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateBrand(uuid, data),
    onSuccess: (updatedBrand) => {
      queryClient.setQueryData(['brands', uuid], updatedBrand);
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('تم تحديث البراند بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'فشل تحديث البراند');
    },
  });
}

export function useDeleteBrand() {
  return useDeleteMutation({
    mutationFn: deleteBrand,
    queryKey: ['brands'],
    successMessage: 'تم حذف البراند بنجاح',
    defaultErrorMessage: 'فشل حذف البراند',
  });
}
