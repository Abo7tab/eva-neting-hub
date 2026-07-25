"use client";

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { ProductFormStepper } from './product-form-stepper';
import { StepBasicInfo } from './steps/step-basic-info';
import { StepImage } from './steps/step-image';
import { StepPricing } from './steps/step-pricing';
import { StepFlags } from './steps/step-flags';
import { StepSeo } from './steps/step-seo';
import { productFormSchema, type ProductFormData } from '../schemas/product.schema';
import type { Product } from '../types/product.types';

const STEPS = [
  { id: 1, title: 'البيانات الأساسية' },
  { id: 2, title: 'صورة المنتج' },
  { id: 3, title: 'السعر والمخزون' },
  { id: 4, title: 'الحالة والعرض' },
  { id: 5, title: 'SEO' },
];

const STEP_REQUIRED_FIELDS: Record<number, (keyof ProductFormData)[]> = {
  1: ['name', 'brand_uuid', 'category_uuid'],
  2: [],
  3: ['price'],
  4: [],
  5: [],
};

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
}

export function ProductForm({ product, onSubmit, isSubmitting, mode }: ProductFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const methods = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema) as any,
    mode: 'onChange',
    defaultValues: product ? {
      name: product.name,
      sku: product.sku || '',
      brand_uuid: product.brand?.uuid || '',
      category_uuid: product.category?.uuid || '',
      short_description: product.short_description || '',
      description: product.description || '',
      weight: product.weight ? Number(product.weight) : undefined,
      weight_unit: (product.weight_unit as any) || 'ml',
      price: Number(product.price),
      compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : null,
      stock_quantity: product.stock_quantity,
      cover_image_url: product.cover_image_url || '',
      storage_public_id: '',
      is_trending: product.is_trending,
      is_featured: product.is_featured,
      active_status: product.active_status,
      seo_title: product.seo_title || '',
      meta_description: product.meta_description || '',
    } : {
      name: '',
      sku: '',
      brand_uuid: '',
      category_uuid: '',
      short_description: '',
      description: '',
      weight_unit: 'ml',
      price: 0,
      stock_quantity: 0,
      cover_image_url: '',
      storage_public_id: '',
      active_status: true,
      is_trending: false,
      is_featured: false,
      seo_title: '',
      meta_description: '',
    },
  });

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (product && !hasInitialized) {
      methods.reset({
        name: product.name,
        sku: product.sku || '',
        brand_uuid: product.brand?.uuid || '',
        category_uuid: product.category?.uuid || '',
        short_description: product.short_description || '',
        description: product.description || '',
        weight: product.weight ? Number(product.weight) : undefined,
        weight_unit: (product.weight_unit as any) || 'ml',
        price: Number(product.price),
        compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : null,
        stock_quantity: product.stock_quantity,
        cover_image_url: product.cover_image_url || '',
        storage_public_id: product.storage_public_id || '',
        is_trending: product.is_trending,
        is_featured: product.is_featured,
        active_status: product.active_status,
        seo_title: product.seo_title || '',
        meta_description: product.meta_description || '',
      });
      setHasInitialized(true);
    }
  }, [product, methods, hasInitialized]);

  const handleNext = async () => {
    const fieldsToValidate = STEP_REQUIRED_FIELDS[currentStep];
    if (fieldsToValidate.length > 0) {
      const isValid = await methods.trigger(fieldsToValidate);
      if (!isValid) {
        toast.error('الرجاء استكمال الحقول المطلوبة');
        return;
      }
    }

    setCompletedSteps((prev) => [...new Set([...prev, currentStep])]);
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const handleFinalSubmit = methods.handleSubmit((data) => {
    onSubmit(data);
  });

  const isLastStep = currentStep === STEPS.length;

  return (
    <FormProvider {...methods}>
      <div className="space-y-6 max-w-5xl mx-auto w-full">
        <ProductFormStepper
          steps={STEPS}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />

        <div className="min-h-[400px]">
          {currentStep === 1 && <StepBasicInfo />}
          {currentStep === 2 && <StepImage product={product} />}
          {currentStep === 3 && <StepPricing />}
          {currentStep === 4 && <StepFlags />}
          {currentStep === 5 && <StepSeo />}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200 py-4 px-4 flex items-center justify-between -mx-4 md:-mx-6 lg:-mx-8 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/products')}
          >
            <X className="ml-2 h-4 w-4" />
            إلغاء
          </Button>

          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                <ChevronRight className="ml-1 h-4 w-4" />
                السابق
              </Button>
            )}
            
            {!isLastStep ? (
              <Button type="button" onClick={handleNext}>
                التالي
                <ChevronLeft className="mr-1 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="ml-2 h-4 w-4 animate-spin" />جاري الحفظ...</>
                ) : (
                  <><Save className="ml-2 h-4 w-4" />{mode === 'create' ? 'إنشاء المنتج' : 'حفظ التغييرات'}</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
