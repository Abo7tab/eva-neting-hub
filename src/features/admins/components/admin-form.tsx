'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { CreateAdminPayload, UpdateAdminPayload, AdminUser } from '../types/admin.types';
import { useCreateAdmin, useUpdateAdmin } from '../hooks/use-admins';

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className={cn("text-sm font-medium", required && "after:content-['*'] after:text-red-500 after:mr-1")}>
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

type AdminFormValues = {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
};

interface AdminFormProps {
  admin?: AdminUser; // If provided, we're editing
}

export function AdminForm({ admin }: AdminFormProps) {
  const router = useRouter();
  const isEditing = !!admin;

  const createMutation = useCreateAdmin();
  const updateMutation = useUpdateAdmin(admin?.id ?? 0);

  const { register, handleSubmit, formState: { errors } } = useForm<AdminFormValues>({
    defaultValues: {
      name: admin?.name ?? '',
      email: admin?.email ?? '',
    },
  });

  const onSubmit = (data: AdminFormValues) => {
    if (isEditing) {
      updateMutation.mutate(
        { name: data.name, email: data.email },
        { onSuccess: () => router.push('/admin/users') }
      );
    } else {
      createMutation.mutate(
        {
          name: data.name,
          email: data.email,
          password: data.password!,
          password_confirmation: data.password_confirmation!,
        },
        { onSuccess: () => router.push('/admin/users') }
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
      <Field label="الاسم الكامل" required error={errors.name?.message}>
        <Input
          placeholder="مثال: محمد أحمد"
          {...register('name', { required: 'الاسم مطلوب' })}
        />
      </Field>

      <Field label="البريد الإلكتروني" required error={errors.email?.message}>
        <Input
          type="email"
          placeholder="admin@evabeauty.com"
          {...register('email', {
            required: 'البريد الإلكتروني مطلوب',
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'بريد إلكتروني غير صالح' },
          })}
        />
      </Field>

      {!isEditing && (
        <>
          <Field label="كلمة المرور" required error={errors.password?.message}>
            <Input
              type="password"
              placeholder="8 أحرف على الأقل"
              {...register('password', {
                required: 'كلمة المرور مطلوبة',
                minLength: { value: 8, message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' },
              })}
            />
          </Field>

          <Field label="تأكيد كلمة المرور" required error={errors.password_confirmation?.message}>
            <Input
              type="password"
              placeholder="أعد كتابة كلمة المرور"
              {...register('password_confirmation', { required: 'تأكيد كلمة المرور مطلوب' })}
            />
          </Field>
        </>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'جاري الحفظ...' : isEditing ? 'حفظ التغييرات' : 'إنشاء الأدمن'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/users')}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}
