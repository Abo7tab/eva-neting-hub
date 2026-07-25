"use client";

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryForm } from '@/features/categories/components/category-form';
import { useCategory, useUpdateCategory, useCategoriesList } from '@/features/categories/hooks/use-categories';
import type { CategoryFormData } from '@/features/categories/schemas/category.schema';
import { Loader2 } from 'lucide-react';

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export default function EditCategoryPage(props: PageProps) {
  const params = use(props.params);
  const router = useRouter();
  
  const { data: categories, isLoading: isListLoading } = useCategoriesList();
  const { data: category, isLoading: isCategoryLoading } = useCategory(params.uuid);
  const updateCategory = useUpdateCategory(params.uuid);

  const handleSubmit = (data: CategoryFormData) => {
    // If empty string, treat as null for root level
    const payload = {
      ...data,
      parent_uuid: data.parent_uuid === '' ? null : data.parent_uuid,
    };

    updateCategory.mutate(payload, {
      onSuccess: () => {
        router.push('/admin/categories');
      },
    });
  };

  if (isListLoading || isCategoryLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500">
        القسم غير موجود.
      </div>
    );
  }

  return (
    <CategoryForm
      initialData={category}
      categories={categories || []}
      onSubmit={handleSubmit}
      isSubmitting={updateCategory.isPending}
    />
  );
}
