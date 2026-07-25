"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Loader2, ChevronRight, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { categoryFormSchema, type CategoryFormData } from '../schemas/category.schema';
import type { Category } from '../types/category.types';
import { CategoryCoverUploader } from './category-cover-uploader';
import { ParentSelector } from './parent-selector';

interface CategoryFormProps {
  initialData?: Category;
  categories: Category[]; // To pass to ParentSelector
  onSubmit: (data: CategoryFormData) => void;
  isSubmitting: boolean;
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function CategoryForm({ initialData, categories, onSubmit, isSubmitting }: CategoryFormProps) {
  const router = useRouter();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      parent_uuid: initialData?.parent_uuid || '',
      cover_image_url: initialData?.cover_image_url || '',
      storage_public_id: initialData?.storage_public_id || '',
      seo_title: initialData?.seo_title || '',
      meta_description: initialData?.meta_description || '',
      active_status: initialData?.active_status ?? true,
      sort_order: initialData?.sort_order || 0,
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
  
  const name = watch('name');
  const slug = watch('slug');
  const parentUuid = watch('parent_uuid');

  // Auto-generate slug for new categories
  useEffect(() => {
    if (!initialData && name && !form.formState.dirtyFields.slug) {
      setValue('slug', slugify(name), { shouldValidate: true });
    }
  }, [name, initialData, setValue, form.formState.dirtyFields.slug]);

  // Calculate current depth and breadcrumb
  const { depth, breadcrumbs } = useMemo(() => {
    let d = 1;
    const crumbs = [name || 'قسم جديد'];
    
    let currentId = parentUuid;
    while (currentId) {
      const parent = categories.find(c => c.uuid === currentId);
      if (parent) {
        d++;
        crumbs.unshift(parent.name);
        currentId = parent.parent_uuid || '';
      } else {
        break;
      }
    }
    
    return { depth: d, breadcrumbs: crumbs };
  }, [parentUuid, name, categories]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-10">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 py-4 -mt-4 mb-4 border-b border-slate-200/50">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {initialData ? 'تعديل القسم' : 'إضافة قسم جديد'}
          </h1>
          <div className="flex items-center text-sm text-slate-500 mt-1 gap-2">
            <Link href="/admin/categories" className="hover:text-rose-600 transition-colors">
              الأقسام
            </Link>
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            <span className="text-slate-900">{initialData?.name || 'قسم جديد'}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/categories')}
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-rose-600 hover:bg-rose-700 min-w-[120px]">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 ml-2" />}
            {initialData ? 'حفظ التعديلات' : 'إنشاء القسم'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-rose-500" />
              المعلومات الأساسية
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">اسم القسم *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  placeholder="مثال: واقيات الشمس"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">الرابط الدائم (Slug)</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  dir="ltr"
                  className={errors.slug ? 'border-red-500 text-left' : 'text-left'}
                  placeholder="sun-protection"
                />
                {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
                {slug && (
                  <p className="text-xs text-slate-500 mt-1" dir="ltr">
                    Preview: /categories/{slug}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>القسم الأب</Label>
              <Controller
                name="parent_uuid"
                control={form.control}
                render={({ field }) => (
                  <ParentSelector
                    categories={categories}
                    currentCategoryUuid={initialData?.uuid}
                    value={field.value || ''}
                    onChange={field.onChange}
                  />
                )}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700">التسلسل:</span> {breadcrumbs.join(' > ')}
                </p>
                <p className="text-xs font-medium text-rose-600">
                  المستوى الحالي: {depth} {depth === 3 && '(الحد الأقصى)'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                {...register('description')}
                className="min-h-[120px]"
                placeholder="اكتب وصفاً قصيراً للقسم يظهر في أعلى صفحة القسم..."
              />
            </div>
          </div>

          {/* SEO Info */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">تحسين محركات البحث (SEO)</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title">عنوان SEO</Label>
                <Input
                  id="seo_title"
                  {...register('seo_title')}
                  placeholder={name || 'يترك فارغاً لاستخدام اسم القسم'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">وصف Meta</Label>
                <Textarea
                  id="meta_description"
                  {...register('meta_description')}
                  className="min-h-[100px]"
                  placeholder="وصف مختصر يظهر في نتائج بحث جوجل..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Cover Image */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">صورة القسم</h2>
            <div className="flex justify-center">
              <Controller
                name="cover_image_url"
                control={form.control}
                render={({ field }) => (
                  <CategoryCoverUploader
                    value={field.value}
                    onChange={(url, publicId) => {
                      field.onChange(url);
                      setValue('storage_public_id', publicId, { shouldDirty: true });
                    }}
                    onRemove={() => {
                      field.onChange('');
                      setValue('storage_public_id', '');
                    }}
                  />
                )}
              />
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">الإعدادات</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>حالة القسم</Label>
                <p className="text-xs text-slate-500 mt-0.5">تفعيل أو إخفاء القسم من المتجر</p>
              </div>
              <Controller
                name="active_status"
                control={form.control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">ترتيب الظهور</Label>
              <Input
                id="sort_order"
                type="number"
                {...register('sort_order')}
                min={0}
                className="w-full text-left"
                dir="ltr"
              />
              <p className="text-xs text-slate-500">الأرقام الأقل تظهر أولاً (0، 1، 2...)</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
