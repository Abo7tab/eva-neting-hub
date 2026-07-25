'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { DialogFooter } from '@/shared/components/ui/dialog';
import type { WhatsAppNumber, CreateWhatsAppNumberPayload, UpdateWhatsAppNumberPayload } from '../types/whatsapp-number.types';

const formSchema = z.object({
  phone_number: z.string()
    .min(1, 'رقم الواتساب مطلوب')
    .regex(/^(\+201|01)[0125][0-9]{8}$/, 'يجب إدخال رقم واتساب مصري صحيح (مثال: 01012345678 أو +201012345678)'),
  display_name: z.string().nullable().optional(),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface WhatsAppNumberFormProps {
  initialData?: WhatsAppNumber | null;
  onSubmit: (data: CreateWhatsAppNumberPayload | UpdateWhatsAppNumberPayload) => void;
  isSubmitting?: boolean;
  onCancel: () => void;
}

export function WhatsAppNumberForm({ initialData, onSubmit, isSubmitting, onCancel }: WhatsAppNumberFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone_number: initialData?.phone_number || '',
      display_name: initialData?.display_name || '',
      is_active: initialData ? initialData.is_active : true,
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      phone_number: values.phone_number,
      display_name: values.display_name || null,
      is_active: values.is_active,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="display_name">الاسم التعريفي (اختياري)</Label>
        <Input
          id="display_name"
          placeholder="مثال: خدمة عملاء 1"
          {...form.register('display_name')}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone_number">رقم الواتساب <span className="text-red-500">*</span></Label>
        <Input
          id="phone_number"
          placeholder="01012345678"
          {...form.register('phone_number')}
          disabled={isSubmitting}
          dir="ltr"
          className="text-right"
        />
        {form.formState.errors.phone_number && (
          <p className="text-sm text-red-500">{form.formState.errors.phone_number.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div className="space-y-0.5">
          <Label htmlFor="is_active">نشط</Label>
          <p className="text-xs text-muted-foreground">
            تفعيل الرقم لاستقبال طلبات جديدة
          </p>
        </div>
        <Switch
          id="is_active"
          checked={form.watch('is_active')}
          onCheckedChange={(checked) => form.setValue('is_active', checked)}
          disabled={isSubmitting}
        />
      </div>

      <DialogFooter className="flex flex-col-reverse sm:flex-row-reverse gap-2 sm:gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? 'جاري الحفظ...' : initialData ? 'حفظ التعديلات' : 'حفظ'}
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          إلغاء
        </Button>
      </DialogFooter>
    </form>
  );
}
