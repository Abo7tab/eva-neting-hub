"use client";

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { CoverImageUploader } from '../cover-image-uploader';
import { ProductGallery } from '../product-gallery';
import type { ProductFormData } from '../../schemas/product.schema';
import type { Product } from '../../types/product.types';

interface StepImageProps {
  product?: Product;
}

export function StepImage({ product }: StepImageProps) {
  const { setValue, watch } = useFormContext<ProductFormData>();
  const coverImageUrl = watch('cover_image_url') || '';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>صورة الغلاف</CardTitle>
        </CardHeader>
        <CardContent>
          <CoverImageUploader
            value={coverImageUrl}
            onChange={(url, publicId) => {
              setValue('cover_image_url', url);
              setValue('storage_public_id', publicId);
            }}
          />
        </CardContent>
      </Card>

      {/* Gallery only in edit mode */}
      {product && (
        <Card>
          <CardHeader>
            <CardTitle>معرض الصور الإضافية</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductGallery
              productUuid={product.uuid}
              images={product.images || []}
            />
          </CardContent>
        </Card>
      )}

      {!product && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-sm text-slate-500">
            💡 يمكنك إضافة صور إضافية للمعرض بعد إنشاء المنتج
          </CardContent>
        </Card>
      )}
    </div>
  );
}
