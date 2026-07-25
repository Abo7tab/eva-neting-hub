"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Upload, X, GripVertical, Loader2, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import {
  useUploadProductImage,
  useDeleteProductImage,
  useReorderProductImages,
} from '../hooks/use-product-images';
import type { ProductImage } from '../types/product.types';

interface ProductGalleryProps {
  productUuid: string;
  images: ProductImage[];
}

interface SortableImageProps {
  image: ProductImage;
  onDelete: (uuid: string) => void;
  isDeleting: boolean;
}

function SortableImage({ image, onDelete, isDeleting }: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.uuid,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-square"
    >
      <Image
        src={image.image_url}
        alt={image.alt_text || 'صورة المنتج'}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      
      {/* Overlay actions */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
        <button
          {...attributes}
          {...listeners}
          type="button"
          className="bg-white/90 hover:bg-white rounded-md p-2 cursor-grab active:cursor-grabbing"
          aria-label="سحب للترتيب"
        >
          <GripVertical className="h-4 w-4 text-slate-700" />
        </button>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => onDelete(image.uuid)}
          disabled={isDeleting}
          className="h-9 w-9"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function ProductGallery({ productUuid, images }: ProductGalleryProps) {
  const [localImages, setLocalImages] = useState(images);
  const uploadImage = useUploadProductImage();
  const deleteImage = useDeleteProductImage(productUuid);
  const reorderImages = useReorderProductImages(productUuid);

  // Sync when images prop changes
  if (JSON.stringify(images) !== JSON.stringify(localImages) && !uploadImage.isPending) {
    setLocalImages(images);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    multiple: true,
    disabled: uploadImage.isPending,
    onDrop: async (files) => {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name}: حجم الصورة يجب أن يكون أقل من 5 ميجابايت`);
          continue;
        }
        await uploadImage.mutateAsync({ productUuid, file });
      }
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localImages.findIndex((img) => img.uuid === active.id);
    const newIndex = localImages.findIndex((img) => img.uuid === over.id);
    const reordered = arrayMove(localImages, oldIndex, newIndex);
    
    setLocalImages(reordered);
    reorderImages.mutate(reordered.map((img) => img.uuid));
  };

  return (
    <div className="space-y-4">
      {/* Existing images grid */}
      {localImages.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={localImages.map((img) => img.uuid)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {localImages.map((image) => (
                <SortableImage
                  key={image.uuid}
                  image={image}
                  onDelete={(uuid) => deleteImage.mutate(uuid)}
                  isDeleting={deleteImage.isPending}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Upload zone */}
      <div
        {...getRootProps()}
        className={cn(
          'relative rounded-lg border-2 border-dashed cursor-pointer transition-colors p-8 text-center',
          isDragActive ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-slate-50 hover:border-slate-400',
          uploadImage.isPending && 'opacity-60 pointer-events-none'
        )}
      >
        <input {...getInputProps()} />
        {uploadImage.isPending ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
            <p className="text-sm text-slate-600">جاري رفع الصور...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ImagePlus className="h-8 w-8 text-slate-400" />
            <p className="text-sm font-medium text-slate-700">
              {isDragActive ? 'أفلت الصور هنا' : 'اسحب صور أو اضغط لإضافتها'}
            </p>
            <p className="text-xs text-slate-500">يمكنك رفع عدة صور دفعة واحدة</p>
          </div>
        )}
      </div>

      {localImages.length > 0 && (
        <p className="text-xs text-slate-500 text-center">
          💡 اسحب الصور لإعادة الترتيب • {localImages.length} صور
        </p>
      )}
    </div>
  );
}
