"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderTree } from 'lucide-react';
import { useCategoriesList } from '@/features/categories/hooks/use-categories';
import { CategoryTree } from '@/features/categories/components/category-tree';
import type { Category } from '@/features/categories/types/category.types';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { ListPageHeader } from '@/shared/components/data/list-page-header';
import { SearchInput } from '@/shared/components/data/search-input';
import { EmptyState } from '@/shared/components/data/empty-state';
import { PaginationBar } from '@/shared/components/data/pagination-bar';

export default function CategoriesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  // We fetch all categories for the tree view to work properly locally.
  const { data: categories, isLoading, error } = useCategoriesList();

  const handleEdit = (uuid: string) => {
    router.push(`/admin/categories/${uuid}/edit`);
  };

  const handleAddChild = (parentUuid: string) => {
    const query = parentUuid ? `?parent=${parentUuid}` : '';
    router.push(`/admin/categories/new${query}`);
  };

  const filteredCategories = categories?.filter(c => 
    c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
    c.slug.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
    c.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <ListPageHeader
        title="شجرة الأقسام"
        description="إدارة هيكل الأقسام، المستويات، وترتيب الظهور في المتجر."
        actionLabel="إضافة قسم جديد"
        actionHref="/admin/categories/new"
      />

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="ابحث عن قسم..."
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
        </div>
      ) : error ? (
        <EmptyState
          icon={FolderTree}
          title="خطأ في التحميل"
          description="حدث خطأ أثناء تحميل الأقسام. يرجى المحاولة مرة أخرى."
        />
      ) : !categories || categories.length === 0 ? (
        <EmptyState
          icon={FolderTree}
          title="لا توجد أقسام"
          description="ابدأ بإضافة قسم جديد لبناء شجرة الأقسام الخاصة بك."
          actionLabel="إضافة قسم جديد"
          actionHref="/admin/categories/new"
        />
      ) : (
        <CategoryTree
          categories={categories}
          searchQuery={debouncedSearch}
          onEdit={handleEdit}
          onAddChild={handleAddChild}
        />
      )}
    </div>
  );
}
