"use client";

import { useState } from 'react';
import { Package, Loader2 } from 'lucide-react';
import { useBrands } from '@/features/brands/hooks/use-brands';
import { BrandCard } from '@/features/brands/components/brand-card';
import { ListPageHeader } from '@/shared/components/data/list-page-header';
import { SearchInput } from '@/shared/components/data/search-input';
import { EmptyState } from '@/shared/components/data/empty-state';
import { PaginationBar } from '@/shared/components/data/pagination-bar';

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 12;
  
  const { data: paginatedBrands, isLoading, isError } = useBrands({ 
    search: searchTerm,
    page: page,
    per_page: perPage
  });

  return (
    <div className="space-y-6">
      <ListPageHeader 
        title="البراندات"
        description="إدارة البراندات والعلامات التجارية للمتجر"
        actionHref="/admin/brands/new"
        actionLabel="إضافة براند جديد"
      />

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <SearchInput
          value={searchTerm}
          onChange={(v) => {
            setSearchTerm(v);
            setPage(1); // Reset to page 1 on search
          }}
          placeholder="البحث عن براند..."
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-red-500">
          حدث خطأ أثناء تحميل البراندات. يرجى المحاولة مرة أخرى.
        </div>
      ) : !paginatedBrands?.data || paginatedBrands.data.length === 0 ? (
        <EmptyState
          icon={Package}
          title="لا توجد براندات بعد"
          description={searchTerm 
            ? "لم يتم العثور على براندات مطابقة للبحث." 
            : "لم تقم بإضافة أي علامة تجارية حتى الآن. ابدأ بإضافة البراند الأول لربطه بالمنتجات."}
          actionHref="/admin/brands/new"
          actionLabel="إضافة براند جديد"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedBrands.data.map((brand) => (
              <BrandCard key={brand.uuid} brand={brand} />
            ))}
          </div>

          {paginatedBrands.meta && (
            <PaginationBar
              currentPage={paginatedBrands.meta.current_page}
              totalPages={paginatedBrands.meta.last_page}
              total={paginatedBrands.meta.total}
              perPage={paginatedBrands.meta.per_page}
              onPageChange={(p) => setPage(p)}
              itemName="براند"
            />
          )}
        </>
      )}
    </div>
  );
}
