'use client';

import { useState } from 'react';
import { Users, Loader2 } from 'lucide-react';
import { useAdminsList } from '@/features/admins/hooks/use-admins';
import { AdminCard } from '@/features/admins/components/admin-card';
import { ListPageHeader } from '@/shared/components/data/list-page-header';
import { SearchInput } from '@/shared/components/data/search-input';
import { EmptyState } from '@/shared/components/data/empty-state';
import { PaginationBar } from '@/shared/components/data/pagination-bar';
import { useAuthStore } from '@/shared/stores/auth.store';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const admin = useAuthStore((state) => state.admin);

  const { data: paginatedAdmins, isLoading, isError } = useAdminsList({
    search,
    page,
    per_page: 12,
  });

  return (
    <div className="space-y-6">
      <ListPageHeader
        title="إدارة الأدمن"
        description="أضف وأدر حسابات مسؤولي لوحة التحكم"
        actionHref="/admin/users/new"
        actionLabel="إضافة أدمن جديد"
      />

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="ابحث بالاسم أو البريد الإلكتروني..."
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-lg border">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-red-500 bg-white rounded-lg border">
          حدث خطأ أثناء تحميل البيانات.
        </div>
      ) : !paginatedAdmins?.data || paginatedAdmins.data.length === 0 ? (
        <EmptyState
          icon={Users}
          title="لا يوجد مسؤولون"
          description={search ? 'لم يتم العثور على نتائج.' : 'لم تقم بإضافة أي مسؤول بعد.'}
          actionHref="/admin/users/new"
          actionLabel="إضافة أدمن جديد"
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedAdmins.data.map((adminUser) => (
              <AdminCard key={adminUser.id} admin={adminUser} currentAdminId={admin?.id} />
            ))}
          </div>
          {paginatedAdmins.meta && (
            <PaginationBar
              currentPage={paginatedAdmins.meta.current_page ?? 1}
              totalPages={paginatedAdmins.meta.last_page ?? 1}
              total={paginatedAdmins.meta.total ?? 0}
              perPage={paginatedAdmins.meta.per_page ?? 12}
              onPageChange={setPage}
              itemName="مسؤول"
            />
          )}
        </div>
      )}
    </div>
  );
}
