"use client";

import { ProductForm } from '@/features/products/components/product-form';
import { useCreateProduct } from '@/features/products/hooks/use-products';

export default function NewProductPage() {
  const createProduct = useCreateProduct();

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">إضافة منتج جديد</h1>
        <p className="text-sm text-slate-500 mt-1">أضف منتج جديد لمتجرك</p>
      </div>
      <ProductForm
        mode="create"
        onSubmit={(data) => createProduct.mutate(data)}
        isSubmitting={createProduct.isPending}
      />
    </div>
  );
}
