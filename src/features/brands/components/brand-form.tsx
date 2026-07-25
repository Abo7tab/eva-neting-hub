"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Loader2, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { brandFormSchema, type BrandFormData } from '../schemas/brand.schema';
import { useCreateBrand, useUpdateBrand } from '../hooks/use-brands';
import type { Brand } from '../types/brand.types';
import { BrandLogoUploader } from './brand-logo-uploader';

interface BrandFormProps {
  brand?: Brand;
}

// Simple slugify for Arabic/English if utils doesn't have it
function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-\u0621-\u064A0-9]+/g, '') // Remove all non-word chars except Arabic
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
}

export function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter();
  const isEdit = !!brand;
  
  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand(brand?.uuid || '');
  const isPending = createMutation.isPending || updateMutation.isPending;

  const methods = useForm<BrandFormData>({
    resolver: zodResolver(brandFormSchema) as any,
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      logo_url: '',
      storage_public_id: '',
      active_status: true,
      sort_order: 0,
      seo_title: '',
      meta_description: '',
    },
  });

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = methods;

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (brand && !hasInitialized) {
      methods.reset({
        name: brand.name,
        slug: brand.slug || '',
        description: brand.description || '',
        logo_url: brand.logo_url || '',
        storage_public_id: brand.storage_public_id || '',
        active_status: brand.active_status,
        sort_order: brand.sort_order,
        seo_title: brand.seo_title || '',
        meta_description: brand.meta_description || '',
      });
      setHasInitialized(true);
    }
  }, [brand, methods, hasInitialized]);

  const nameValue = watch('name');
  const slugValue = watch('slug');
  const generatedSlug = generateSlug(nameValue || '');
  const previewSlug = slugValue || generatedSlug;

  const onSubmit = async (data: BrandFormData) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync(data);
        router.push('/admin/brands');
      } else {
        await createMutation.mutateAsync(data);
        router.push('/admin/brands');
      }
    } catch (error) {
      // Error is handled by mutation toast
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {isEdit ? 'تعديل البراند' : 'إضافة براند جديد'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            أدخل تفاصيل البراند هنا. سيتم ظهور هذا البراند في قوائم المنتجات.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/brands')}
            disabled={isPending}
          >
            إلغاء
          </Button>
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {!isPending && <Save className="h-4 w-4" />}
            حفظ البراند
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">اسم البراند <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  placeholder="مثال: لوريال، إيفا، نيفيا"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                
                {/* Live Slug Preview */}
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-md border border-slate-100">
                  <LinkIcon className="h-3 w-3" />
                  <span dir="ltr" className="font-mono text-slate-600">/brands/{previewSlug || '...'}</span>
                  {nameValue && <span className="text-green-600 flex items-center gap-1 mr-auto"><CheckCircle2 className="h-3 w-3"/> سيتم إنشاء الرابط</span>}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="slug">
                  الرابط المخصص (Slug) 
                  <span className="text-slate-400 font-normal text-xs mr-2">(اختياري - يتم توليده تلقائياً إذا تُرك فارغاً)</span>
                </Label>
                <Input
                  id="slug"
                  placeholder="مثال: loreal-paris"
                  dir="ltr"
                  className="text-left"
                  {...register('slug')}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">وصف البراند (اختياري)</Label>
                <Textarea
                  id="description"
                  placeholder="وصف مختصر للبراند..."
                  rows={4}
                  {...register('description')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تحسين محركات البحث (SEO)</CardTitle>
              <CardDescription>هذه المعلومات تساعد في ظهور البراند في نتائج بحث جوجل</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="seo_title">عنوان صفحة البراند (SEO Title)</Label>
                <Input
                  id="seo_title"
                  placeholder="يظهر في عنوان المتصفح..."
                  {...register('seo_title')}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="meta_description">وصف الميتا (Meta Description)</Label>
                <Textarea
                  id="meta_description"
                  placeholder="يظهر كوصف قصير تحت الرابط في جوجل..."
                  rows={3}
                  {...register('meta_description')}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>شعار البراند</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                control={control}
                name="logo_url"
                render={({ field }) => (
                  <BrandLogoUploader
                    value={field.value || ''}
                    onChange={(url, publicId) => {
                      field.onChange(url);
                      setValue('storage_public_id', publicId);
                    }}
                  />
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الإعدادات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>حالة البراند</Label>
                  <p className="text-sm text-slate-500">تفعيل أو إخفاء البراند من المتجر</p>
                </div>
                <Controller
                  control={control}
                  name="active_status"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      dir="ltr"
                    />
                  )}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sort_order">ترتيب العرض</Label>
                <Input
                  id="sort_order"
                  type="number"
                  min="0"
                  {...register('sort_order')}
                />
                <p className="text-xs text-slate-500">الرقم الأقل يظهر أولاً (مثال: 0، 1، 2)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
