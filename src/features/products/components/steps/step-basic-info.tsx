"use client";

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/shared/components/ui/select';
import { useBrandsList } from '@/features/brands/hooks/use-brands';
import { useCategoriesList } from '@/features/categories/hooks/use-categories';
import type { ProductFormData } from '../../schemas/product.schema';

export function StepBasicInfo() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<ProductFormData>();
  const { data: brands = [] } = useBrandsList();
  const { data: rawCategories = [] } = useCategoriesList();

  const getHierarchicalCategories = (cats: any[]) => {
    const map = new Map<string, any[]>();
    const roots: any[] = [];
    cats.forEach(c => {
      if (c.parent_uuid) {
        if (!map.has(c.parent_uuid)) map.set(c.parent_uuid, []);
        map.get(c.parent_uuid)!.push(c);
      } else {
        roots.push(c);
      }
    });

    const result: any[] = [];
    const traverse = (node: any, level: number) => {
      result.push({ ...node, level });
      const children = map.get(node.uuid) || [];
      children.forEach(child => traverse(child, level + 1));
    };
    roots.forEach(root => traverse(root, 0));
    return result;
  };

  const categories = getHierarchicalCategories(rawCategories);

  console.log('Brands loaded:', brands);
  console.log('Categories loaded:', categories);

  const brandUuid = watch('brand_uuid') || '';
  const categoryUuid = watch('category_uuid') || '';

  return (
    <Card>
      <CardHeader>
        <CardTitle>البيانات الأساسية</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>اسم المنتج *</Label>
          <Input {...register('name')} placeholder="مثال: صن بلوك إيفا SPF 50" />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label>SKU (اختياري)</Label>
          <Input {...register('sku')} placeholder="EVA-SB-50" dir="ltr" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>البراند *</Label>
            <Select value={brandUuid} onValueChange={(v) => setValue('brand_uuid', v || '', { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="اختر البراند">
                  {brandUuid ? brands.find((b: any) => b.uuid === brandUuid)?.name || 'اختر البراند' : 'اختر البراند'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {brands.map((b: any) => (
                  <SelectItem key={b.uuid} value={b.uuid}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.brand_uuid && <p className="text-xs text-red-500 mt-1">{errors.brand_uuid.message}</p>}
          </div>

          <div>
            <Label>القسم *</Label>
            <Select value={categoryUuid} onValueChange={(v) => setValue('category_uuid', v || '', { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="اختر القسم">
                  {categoryUuid ? categories.find((c: any) => c.uuid === categoryUuid)?.name || 'اختر القسم' : 'اختر القسم'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((c: any) => (
                  <SelectItem key={c.uuid} value={c.uuid}>
                    {'\u00A0\u00A0\u00A0\u00A0'.repeat(c.level || 0)}{c.level > 0 ? '— ' : ''}{c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_uuid && <p className="text-xs text-red-500 mt-1">{errors.category_uuid.message}</p>}
          </div>
        </div>

        <div>
          <Label>الوصف المختصر</Label>
          <Textarea {...register('short_description')} rows={2} placeholder="وصف قصير يظهر في بطاقة المنتج" />
        </div>

        <div>
          <Label>الوصف الكامل</Label>
          <Textarea {...register('description')} rows={5} placeholder="وصف تفصيلي للمنتج" />
        </div>
      </CardContent>
    </Card>
  );
}
