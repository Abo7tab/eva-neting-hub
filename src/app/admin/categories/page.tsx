"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, FolderTree, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useCategoriesList } from '@/features/categories/hooks/use-categories';
import { CategoryTree } from '@/features/categories/components/category-tree';
import { DeleteCategoryDialog } from '@/features/categories/components/delete-category-dialog';
import type { Category } from '@/features/categories/types/category.types';
import { useDebounce } from '@/shared/hooks/use-debounce'; // Assuming you have this, otherwise we'll handle search locally or implement a simple debounce. Let's assume we have it. If not, I'll use a simple state.

export default function CategoriesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  
  // Actually we fetch all categories at once for the tree view to work properly locally.
  const { data: categories, isLoading, error } = useCategoriesList();
  
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleEdit = (uuid: string) => {
    router.push(`/admin/categories/${uuid}/edit`);
  };

  const handleAddChild = (parentUuid: string) => {
    const query = parentUuid ? `?parent=${parentUuid}` : '';
    router.push(`/admin/categories/new${query}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderTree className="h-6 w-6 text-rose-500" />
            شجرة الأقسام
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            إدارة هيكل الأقسام، المستويات، وترتيب الظهور في المتجر.
          </p>
        </div>
        <Button onClick={() => handleAddChild('')} className="bg-rose-600 hover:bg-rose-700">
          <Plus className="h-4 w-4 ml-2" />
          إضافة قسم جديد
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center">
        <div className="relative max-w-sm w-full">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="ابحث عن قسم..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl border border-slate-200 shadow-sm mt-6">
          <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl border border-red-200 text-red-500 shadow-sm mt-6">
          حدث خطأ أثناء تحميل الأقسام.
        </div>
      ) : (
        <CategoryTree
          categories={categories || []}
          searchQuery={search}
          onEdit={handleEdit}
          onDelete={(cat) => setCategoryToDelete(cat)}
          onAddChild={handleAddChild}
        />
      )}

      {/* Delete Dialog */}
      <DeleteCategoryDialog
        category={categoryToDelete}
        isOpen={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      />
    </div>
  );
}
