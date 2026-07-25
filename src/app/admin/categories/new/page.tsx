"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { CategoryForm } from '@/features/categories/components/category-form';
import { useCreateCategory, useCategoriesList } from '@/features/categories/hooks/use-categories';
import type { CategoryFormData } from '@/features/categories/schemas/category.schema';
import { Loader2 } from 'lucide-react';

export default function NewCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentUuid = searchParams.get('parent') || '';

  const { data: categories, isLoading } = useCategoriesList();
  const createCategory = useCreateCategory();

  const handleSubmit = (data: CategoryFormData) => {
    // If empty string, treat as null for root level
    const payload = {
      ...data,
      parent_uuid: data.parent_uuid === '' ? null : data.parent_uuid,
    };
    
    createCategory.mutate(payload, {
      onSuccess: () => {
        router.push('/admin/categories');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  // Pre-fill parent_uuid if provided in query params
  const initialData = {
    parent_uuid: parentUuid,
  } as any;

  return (
    <CategoryForm
      initialData={parentUuid ? initialData : undefined}
      categories={categories || []}
      onSubmit={handleSubmit}
      isSubmitting={createCategory.isPending}
    />
  );
}
