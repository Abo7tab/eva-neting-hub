'use client';

import { AdminForm } from '@/features/admins/components/admin-form';

export default function NewAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">إضافة أدمن جديد</h1>
        <p className="text-slate-500 mt-1">إنشاء حساب مسؤول جديد للوحة التحكم</p>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <AdminForm />
      </div>
    </div>
  );
}
