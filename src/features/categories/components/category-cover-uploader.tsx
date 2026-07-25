"use client";

import { useState } from 'react';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { uploadCategoryCover } from '../api/categories.api';
import { cn } from '@/shared/lib/utils';

interface CategoryCoverUploaderProps {
  value?: string | null;
  onChange: (url: string, publicId: string) => void;
  onRemove: () => void;
}

export function CategoryCoverUploader({ value, onChange, onRemove }: CategoryCoverUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        setIsUploading(true);
        const { url, public_id } = await uploadCategoryCover(file);
        onChange(url, public_id);
        toast.success('تم رفع الصورة بنجاح');
      } catch (error) {
        toast.error('حدث خطأ أثناء رفع الصورة');
      } finally {
        setIsUploading(false);
      }
    },
    onDropRejected: () => {
      toast.error('الملف غير صالح. يجب أن يكون صورة بحجم أقل من 2 ميجابايت.');
    },
  });

  if (value) {
    return (
      <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-slate-200 group">
        <Image src={value} alt="Category Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={onRemove}
            className="p-2 bg-white text-red-500 rounded-full hover:bg-red-50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "w-40 h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50",
        isDragActive ? "border-rose-500 bg-rose-50" : "border-slate-200 hover:border-rose-300 hover:bg-rose-50/30",
        isUploading && "opacity-50 pointer-events-none"
      )}
    >
      <input {...getInputProps()} />
      <UploadCloud className={cn("h-8 w-8", isDragActive ? "text-rose-500" : "text-slate-400")} />
      <div className="text-xs text-center px-4">
        {isUploading ? (
          <span className="text-rose-600 font-medium">جاري الرفع...</span>
        ) : (
          <span className="text-slate-500">
            <span className="font-semibold text-rose-600">انقر هنا</span> أو اسحب الصورة (الحد الأقصى 2MB)
          </span>
        )}
      </div>
    </div>
  );
}
