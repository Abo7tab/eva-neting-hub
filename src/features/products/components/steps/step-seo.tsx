"use client";

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import type { ProductFormData } from '../../schemas/product.schema';

export function StepSeo() {
  const { register, watch } = useFormContext<ProductFormData>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>إعدادات SEO (اختياري)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>عنوان SEO</Label>
          <Input {...register('seo_title')} placeholder="عنوان يظهر في جوجل" />
        </div>
        <div>
          <Label>الوصف الظاهر في جوجل</Label>
          <Textarea {...register('meta_description')} rows={3} maxLength={320} />
          <p className="text-xs text-slate-500 mt-1">
            {(watch('meta_description') || '').length} / 320 حرف
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
