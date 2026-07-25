"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchCategories,
  fetchAllCategories,
  fetchCategoryByUuid,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/categories.api';
import type { CategoriesListParams } from '../types/category.types';

export function useCategories(params: CategoriesListParams = {}) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => fetchCategories(params),
  });
}

export function useCategoriesList() {
  return useQuery({
    queryKey: ['categories', 'all'],
    queryFn: fetchAllCategories,
  });
}

export function useCategory(uuid: string) {
  return useQuery({
    queryKey: ['categories', uuid],
    queryFn: () => fetchCategoryByUuid(uuid),
    enabled: !!uuid,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('تم إنشاء القسم بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'فشل إنشاء القسم');
    },
  });
}

export function useUpdateCategory(uuid: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateCategory(uuid, data),
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(['categories', uuid], updatedCategory);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('تم تحديث القسم بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'فشل تحديث القسم');
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('تم حذف القسم بنجاح');
    },
    onError: (error: any) => {
      const backendMessage = error?.response?.data?.message;
      toast.error(backendMessage || 'فشل حذف القسم');
    },
  });
}
