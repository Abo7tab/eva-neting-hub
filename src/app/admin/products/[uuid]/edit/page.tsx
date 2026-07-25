"use client";

import { use } from 'react';
import { Loader2 } from 'lucide-react';
import { ProductForm } from '@/features/products/components/product-form';
import { useProduct, useUpdateProduct } from '@/features/products/hooks/use-products';

interface Props {
  params: Promise<{ uuid: string }>;
}

export default function EditProductPage({ params }: Props) {
  const { uuid } = use(params);
  const { data: product, isLoading } = useProduct(uuid);
  const updateProduct = useUpdateProduct(uuid);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-24 text-slate-500">المنتج غير موجود</div>;
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">تعديل المنتج</h1>
        <p className="text-sm text-slate-500 mt-1">{product.name}</p>
      </div>
      <ProductForm
        mode="edit"
        product={product}
        onSubmit={(data) => updateProduct.mutate(data)}
        isSubmitting={updateProduct.isPending}
      />
    </div>
  );
}
