"use client";

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { uploadBrandLogo } from '../api/brands.api';

interface BrandLogoUploaderProps {
  value: string;
  onChange: (url: string, publicId: string) => void;
  className?: string;
}

export function BrandLogoUploader({ value, onChange, className }: BrandLogoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }

      setIsUploading(true);
      try {
        const result = await uploadBrandLogo(file);
        onChange(result.url, result.public_id);
        toast.success('تم رفع الشعار بنجاح');
      } catch (error) {
        toast.error('فشل رفع الشعار');
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.svg'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('', '');
  };

  if (value) {
    return (
      <div className={cn('relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center p-4', className)}>
        <div className="relative w-full max-w-[200px] aspect-square">
          <Image
            src={value}
            alt="شعار البراند"
            fill
            sizes="200px"
            className="object-contain"
          />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById('brand-logo-upload')?.click()}
          >
            تغيير
          </Button>
          <Button type="button" variant="destructive" onClick={clearImage}>
            حذف
          </Button>
          <input
            id="brand-logo-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.length) {
                onDrop(Array.from(e.target.files));
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative rounded-lg border-2 border-dashed cursor-pointer transition-colors flex flex-col items-center justify-center p-8',
        isDragActive ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-slate-50 hover:border-slate-400',
        isUploading && 'opacity-60 pointer-events-none',
        className
      )}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
          <p className="text-sm text-slate-600">جاري الرفع...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="p-3 bg-white rounded-full shadow-sm">
            <Upload className="h-6 w-6 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">
              {isDragActive ? 'أفلت الشعار هنا' : 'اسحب الشعار أو اضغط لاختياره'}
            </p>
            <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP, SVG حتى 5MB</p>
          </div>
        </div>
      )}
    </div>
  );
}
