'use client';

import { use } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminForm } from '@/features/admins/components/admin-form';
import { useAdminDetails } from '@/features/admins/hooks/use-admins';

interface EditAdminPageProps {
  params: Promise<{ id: string }>;
}

export default function EditAdminPage({ params }: EditAdminPageProps) {
  const { id } = use(params);
  const adminId = Number(id);

  const { data: adminResponse, isLoading, isError } = useAdminDetails(adminId, { enabled: !!adminId });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (isError || !adminResponse?.data) {
    return (
      <div className="text-center py-20 text-red-500">
        لم يتم العثور على الأدمن.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">تعديل بيانات: {adminResponse.data.name}</h1>
        <p className="text-slate-500 mt-1">تحديث الاسم أو البريد الإلكتروني</p>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <AdminForm admin={adminResponse.data} />
      </div>
    </div>
  );
}
