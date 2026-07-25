"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Loader2 } from 'lucide-react';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useProducts } from '@/features/products/hooks/use-products';
import { ProductFilters } from '@/features/products/components/product-filters';
import { ProductsTable } from '@/features/products/components/products-table';
import { ListPageHeader } from '@/shared/components/data/list-page-header';
import { SearchInput } from '@/shared/components/data/search-input';
import { EmptyState } from '@/shared/components/data/empty-state';
import { PaginationBar } from '@/shared/components/data/pagination-bar';
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
  const perPage = 20;

  // Debounced search
  const debouncedSearch = useDebounce(search, 500);

  // Fetch data
  const { data: paginatedProducts, isLoading, isError } = useProducts({
    search: debouncedSearch || undefined,
    brand_uuid: brandUuid,
    category_uuid: categoryUuid,
    active_status: status === 'active' ? true : status === 'inactive' ? false : undefined,
    sort_by: sortBy as any,
    page,
    per_page: perPage,
  });

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

  const { data: brands = [] } = useBrandsList();
  const { data: categories = [] } = useCategoriesList();

  return (
    <div className="space-y-6">
      <ListPageHeader 
        title="المنتجات"
        description="إدارة كل المنتجات في متجرك"
        actionHref="/admin/products/new"
        actionLabel="إضافة منتج"
      />

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <div className="max-w-sm">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="ابحث بالاسم أو SKU..."
          />
        </div>
        
        <ProductFilters
          sortBy={sortBy}
          onSortChange={(v) => { setSortBy(v); setPage(1); }}
          brandUuid={brandUuid}
          onBrandChange={(v) => { setBrandUuid(v); setPage(1); }}
          categoryUuid={categoryUuid}
          onCategoryChange={(v) => { setCategoryUuid(v); setPage(1); }}
          status={status}
          onStatusChange={(v) => { setStatus(v); setPage(1); }}
          brands={brands}
          categories={categories}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-red-500">
          حدث خطأ أثناء تحميل المنتجات. يرجى المحاولة مرة أخرى.
        </div>
      ) : !paginatedProducts?.data || paginatedProducts.data.length === 0 ? (
        <EmptyState
          icon={Package}
          title="لا توجد منتجات بعد"
          description={hasActiveFilters 
            ? "لم يتم العثور على منتجات مطابقة للبحث أو الفلاتر المحددة." 
            : "لم تقم بإضافة أي منتج حتى الآن. ابدأ بإضافة منتجك الأول."}
          actionHref="/admin/products/new"
          actionLabel="إضافة منتج جديد"
        />
      ) : (
        <>
          <ProductsTable
            products={paginatedProducts.data}
            isLoading={false}
            onEdit={handleEdit}
            onDelete={() => {}} // Deletion is handled inside table now
          />

          {paginatedProducts.meta && (
            <PaginationBar
              currentPage={paginatedProducts.meta.current_page}
              totalPages={paginatedProducts.meta.last_page}
              total={paginatedProducts.meta.total}
              perPage={paginatedProducts.meta.per_page}
              onPageChange={(p) => setPage(p)}
              itemName="منتج"
            />
          )}
        </>
      )}
    </div>
  );
}
