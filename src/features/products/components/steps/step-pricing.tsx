"use client";

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/shared/components/ui/select';
import type { ProductFormData } from '../../schemas/product.schema';

export function StepPricing() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<ProductFormData>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>السعر والمخزون</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>السعر *</Label>
            <Input type="number" step="0.01" {...register('price')} placeholder="0.00" dir="ltr" />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <Label>السعر قبل الخصم (اختياري)</Label>
            <Input type="number" step="0.01" {...register('compare_at_price')} placeholder="0.00" dir="ltr" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>الكمية المتاحة</Label>
            <Input type="number" {...register('stock_quantity')} dir="ltr" />
          </div>
          <div>
            <Label>الحجم/الوزن</Label>
            <Input type="number" step="0.01" {...register('weight')} placeholder="100" dir="ltr" />
          </div>
          <div>
            <Label>الوحدة</Label>
            <Select value={watch('weight_unit')} onValueChange={(v: any) => setValue('weight_unit', v || 'ml')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ml">مل</SelectItem>
                <SelectItem value="g">جرام</SelectItem>
                <SelectItem value="kg">كيلو</SelectItem>
                <SelectItem value="piece">قطعة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
