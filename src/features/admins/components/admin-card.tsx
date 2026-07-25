'use client';

import { useState } from 'react';
import { AdminUser } from '../types/admin.types';
import { useDeleteAdmin, useResetAdminPassword } from '../hooks/use-admins';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { ConfirmDeleteDialog } from '@/shared/components/feedback/confirm-delete-dialog';
import { useRouter } from 'next/navigation';
import { Edit2, KeyRound, Trash2, UserCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { useForm } from 'react-hook-form';
import { ResetPasswordPayload } from '../types/admin.types';

interface AdminCardProps {
  admin: AdminUser;
  currentAdminId?: number;
}

export function AdminCard({ admin, currentAdminId }: AdminCardProps) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin({
    onSuccess: () => setShowDelete(false),
  });
  const { mutate: resetPassword, isPending: isResetting } = useResetAdminPassword();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ResetPasswordPayload & { password_confirmation: string }>();

  const isCurrentUser = currentAdminId === admin.id;

  const onResetSubmit = (data: ResetPasswordPayload) => {
    resetPassword({ id: admin.id, data }, {
      onSuccess: () => {
        setShowReset(false);
        reset();
      },
    });
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="p-5 flex flex-col gap-4">
          {/* Avatar */}
          <div className="flex items-start justify-between">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary text-2xl font-bold border border-primary/20">
              {admin.name.charAt(0).toUpperCase()}
            </div>
            {isCurrentUser && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">أنت</span>
            )}
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-slate-900 truncate text-base" title={admin.name}>
              {admin.name}
            </h3>
            <p className="text-sm text-slate-500 truncate mt-0.5">{admin.email}</p>
            <p className="text-xs text-slate-400 mt-2">
              انضم: {new Date(admin.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => router.push(`/admin/users/${admin.id}/edit`)}
            >
              <Edit2 className="h-3.5 w-3.5 ml-1" />
              تعديل
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setShowReset(true)}
            >
              <KeyRound className="h-3.5 w-3.5 ml-1" />
              كلمة المرور
            </Button>
            {!isCurrentUser && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => setShowDelete(true)}
                title="حذف الأدمن"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="حذف الأدمن"
        itemName={admin.name}
        description="سيتم حذف هذا الحساب نهائياً ولن يتمكن من الدخول للوحة التحكم."
        onConfirm={() => deleteAdmin(String(admin.id))}
        isPending={isDeleting}
      />

      {/* Reset Password Dialog */}
      <Dialog open={showReset} onOpenChange={setShowReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إعادة تعيين كلمة مرور {admin.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onResetSubmit)} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1">كلمة المرور الجديدة</label>
              <Input
                type="password"
                placeholder="8 أحرف على الأقل"
                {...register('password', { required: 'مطلوب', minLength: { value: 8, message: '8 أحرف على الأقل' } })}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">تأكيد كلمة المرور</label>
              <Input
                type="password"
                placeholder="أعد كتابة كلمة المرور"
                {...register('password_confirmation', { required: 'مطلوب' })}
              />
              {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => { setShowReset(false); reset(); }}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isResetting}>
                {isResetting ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
