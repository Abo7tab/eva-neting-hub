"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  uploadProductImage,
  deleteProductImage,
  reorderProductImages,
  updateImageAltText,
} from '../api/products.api';

export function useUploadProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productUuid, file, altText }: any) =>
      uploadProductImage(productUuid, file, altText),
    onSuccess: (newImage, variables) => {
      // Update cache directly without triggering refetch
      queryClient.setQueryData(
        ['products', variables.productUuid],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            images: [...(old.images || []), newImage],
          };
        }
      );
      toast.success('تم رفع الصورة');
    },
    onError: () => toast.error('فشل رفع الصورة'),
  });
}

export function useDeleteProductImage(productUuid: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageUuid: string) => deleteProductImage(imageUuid),
    onSuccess: (_, imageUuid) => {
      queryClient.setQueryData(
        ['products', productUuid],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            images: (old.images || []).filter((img: any) => img.uuid !== imageUuid),
          };
        }
      );
      toast.success('تم حذف الصورة');
    },
    onError: () => toast.error('فشل حذف الصورة'),
  });
}

export function useReorderProductImages(productUuid: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageUuids: string[]) => reorderProductImages(productUuid, imageUuids),
    onSuccess: (_, imageUuids) => {
      queryClient.setQueryData(
        ['products', productUuid],
        (old: any) => {
          if (!old) return old;
          // Reorder the images in cache based on the new array of uuids
          const sortedImages = [...(old.images || [])].sort((a, b) => {
            return imageUuids.indexOf(a.uuid) - imageUuids.indexOf(b.uuid);
          });
          return {
            ...old,
            images: sortedImages,
          };
        }
      );
      toast.success('تم تحديث الترتيب');
    },
    onError: () => toast.error('فشل تحديث الترتيب'),
  });
}
