"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useProducts, useDeleteProduct } from '@/features/products/hooks/use-products';
import { ProductFilters } from '@/features/products/components/product-filters';
import { ProductsTable } from '@/features/products/components/products-table';
import { ProductsPagination } from '@/features/products/components/products-pagination';
import { DeleteConfirmDialog } from '@/features/products/components/delete-confirm-dialog';
import type { Product } from '@/features/products/types/product.types';

import { useBrandsList } from '@/features/brands/hooks/use-brands';
import { useCategoriesList } from '@/features/categories/hooks/use-categories';

export default function ProductsPage() {
  const router = useRouter();
  
  // Filters state
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [brandUuid, setBrandUuid] = useState<string | undefined>();
  const [categoryUuid, setCategoryUuid] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  
  // Delete state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Debounced search
  const debouncedSearch = useDebounce(search, 500);

  // Fetch data
  const { data, isLoading } = useProducts({
    search: debouncedSearch || undefined,
    brand_uuid: brandUuid,
    category_uuid: categoryUuid,
    active_status: status === 'active' ? true : status === 'inactive' ? false : undefined,
    sort_by: sortBy as any,
    page,
    per_page: 20,
  });

  const deleteProduct = useDeleteProduct();

  const hasActiveFilters = !!(
    search || brandUuid || categoryUuid || status || sortBy !== 'newest'
  );

  const handleResetFilters = () => {
    setSearch('');
    setBrandUuid(undefined);
    setCategoryUuid(undefined);
    setStatus(undefined);
    setSortBy('newest');
    setPage(1);
  };

  const handleEdit = (uuid: string) => {
    router.push(`/admin/products/${uuid}/edit`);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct.mutate(productToDelete.uuid, {
        onSuccess: () => setProductToDelete(null),
      });
    }
  };

  const { data: brands = [] } = useBrandsList();
  const { data: categories = [] } = useCategoriesList();

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">المنتجات</h1>
          <p className="text-sm text-slate-500 mt-1">
            إدارة كل المنتجات في متجرك
          </p>
        </div>
        <Button onClick={() => router.push('/admin/products/new')}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة منتج
        </Button>
      </div>

      {/* Filters */}
      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        brandUuid={brandUuid}
        onBrandChange={setBrandUuid}
        categoryUuid={categoryUuid}
        onCategoryChange={setCategoryUuid}
        status={status}
        onStatusChange={setStatus}
        brands={brands}
        categories={categories}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Table */}
      <ProductsTable
        products={data?.data}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {data?.meta && (
        <ProductsPagination
          currentPage={data.meta.current_page}
          totalPages={data.meta.last_page}
          total={data.meta.total}
          perPage={data.meta.per_page}
          onPageChange={setPage}
        />
      )}

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        product={productToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setProductToDelete(null)}
        isPending={deleteProduct.isPending}
      />
    </div>
  );
}
