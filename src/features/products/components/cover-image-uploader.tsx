"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { uploadProductCoverImage } from '../api/products.api';

interface CoverImageUploaderProps {
  value: string;
  onChange: (url: string, publicId: string) => void;
}

export function CoverImageUploader({ value, onChange }: CoverImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }
    
    setUploading(true);
    try {
      const result = await uploadProductCoverImage(file);
      onChange(result.url, result.public_id);
      toast.success('تم رفع الصورة');
    } catch (err: any) {
      const errorMsg = err?.message || 'فشل رفع الصورة';
      if (errorMsg.includes('could not be found') || errorMsg.includes('404')) {
        toast.error('خدمة رفع الصور غير متاحة حالياً. سيتم إضافتها قريباً.');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    disabled: uploading,
  });

  if (value) {
    return (
      <div className="space-y-2">
        {/* Image preview */}
        <div className="relative w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group flex items-center justify-center min-h-[200px] max-h-[500px]">
          <Image 
            src={value} 
            alt="صورة المنتج" 
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, 800px"
            className="w-auto h-auto max-w-full max-h-[500px] object-contain"
            style={{ width: 'auto', height: 'auto' }}
            unoptimized={false}
          />
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handleUpload(file);
                  }
                }}
              />
              <div className="bg-white text-slate-900 hover:bg-slate-100 rounded-md px-4 py-2 text-sm font-medium flex items-center gap-2 shadow-lg">
                <Upload className="h-4 w-4" />
                استبدال الصورة
              </div>
            </label>
          </div>
        </div>
        
        {/* Action buttons below image (always visible) */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
          <span className="truncate">
            <ImageIcon className="h-3 w-3 inline ml-1" />
            الصورة مرفوعة بنجاح
          </span>
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handleUpload(file);
                  }
                }}
              />
              <span className="text-rose-600 hover:text-rose-700 font-medium">
                تغيير
              </span>
            </label>
            <button
              type="button"
              onClick={() => onChange('', '')}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              حذف
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative w-full min-h-[180px] max-h-[300px] rounded-lg border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center py-10',
        isDragActive 
          ? 'border-rose-400 bg-rose-50' 
          : 'border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100'
      )}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <>
          <Loader2 className="h-10 w-10 text-slate-400 animate-spin mb-3" />
          <p className="text-sm text-slate-600">جاري رفع الصورة...</p>
        </>
      ) : (
        <>
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
            <Upload className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-900 mb-1">
            {isDragActive ? 'أفلت الصورة هنا' : 'اسحب الصورة أو اضغط للاختيار'}
          </p>
          <p className="text-xs text-slate-500">
            PNG, JPG, WEBP - حتى 5MB
          </p>
        </>
      )}
    </div>
  );
}
