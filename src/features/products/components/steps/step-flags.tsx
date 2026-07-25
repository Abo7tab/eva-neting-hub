"use client";

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import type { ProductFormData } from '../../schemas/product.schema';

export function StepFlags() {
  const { setValue, watch } = useFormContext<ProductFormData>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>الحالة والعرض</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>منتج نشط</Label>
            <p className="text-xs text-slate-500 mt-0.5">يظهر في المتجر للعملاء</p>
          </div>
          <Switch checked={watch('active_status')} onCheckedChange={(v) => setValue('active_status', v)} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>رائج</Label>
            <p className="text-xs text-slate-500 mt-0.5">يظهر في قسم المنتجات الرائجة</p>
          </div>
          <Switch checked={watch('is_trending')} onCheckedChange={(v) => setValue('is_trending', v)} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>مميز</Label>
            <p className="text-xs text-slate-500 mt-0.5">يظهر في الصفحة الرئيسية</p>
          </div>
          <Switch checked={watch('is_featured')} onCheckedChange={(v) => setValue('is_featured', v)} />
        </div>
      </CardContent>
    </Card>
  );
}
