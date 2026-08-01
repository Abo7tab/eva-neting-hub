'use client';

import { useState } from 'react';
import { OrdersStats } from '@/features/orders/components/orders-stats';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useOrdersList } from '@/features/orders/hooks/use-orders';
import { OrdersListParams } from '@/features/orders/types/order.types';
import { OrdersFilters } from '@/features/orders/components/orders-filters';
import { OrdersTable } from '@/features/orders/components/orders-table';
import { ListPageHeader } from '@/shared/components/data/list-page-header';
import { EmptyState } from '@/shared/components/data/empty-state';
import { PaginationBar } from '@/shared/components/data/pagination-bar';

export default function OrdersPage() {
  const [filters, setFilters] = useState<OrdersListParams>({ page: 1, per_page: 12 });
  
  const { data: paginatedOrders, isLoading, isError } = useOrdersList(filters);

  const handleFilterChange = (key: keyof OrdersListParams, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // reset page on filter change
    }));
  };

  return (
    <div className="space-y-6">
      <ListPageHeader 
        title="الطلبات"
        description="إدارة طلبات العملاء وتحديث حالاتها"
        // No actionHref because orders are created by customers via WhatsApp link
      />

      <OrdersStats />

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <OrdersFilters filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-lg border">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-red-500 bg-white rounded-lg border">
          حدث خطأ أثناء تحميل الطلبات. يرجى المحاولة مرة أخرى.
        </div>
      ) : !paginatedOrders?.data || paginatedOrders.data.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="لا توجد نتائج للبحث"
          description={filters.search || filters.status || filters.sort_by
            ? "لم يتم العثور على طلبات مطابقة للبحث أو الفلتر." 
            : "لم يقم أي عميل بإتمام طلب حتى الآن."}
        />
      ) : (
        <div className="space-y-4">
          <OrdersTable orders={paginatedOrders.data} isLoading={false} />

          {paginatedOrders.meta && (
            <PaginationBar
              currentPage={paginatedOrders.meta.current_page ?? 1}
              totalPages={paginatedOrders.meta.last_page ?? 1}
              total={paginatedOrders.meta.total ?? 0}
              perPage={paginatedOrders.meta.per_page ?? 12}
              onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))}
              itemName="طلب"
            />
          )}
        </div>
      )}
    </div>
  );
}

