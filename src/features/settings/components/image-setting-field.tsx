import React, { useRef, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { apiClient } from '@/shared/lib/api-client';
import { toast } from 'sonner';
import { SETTING_LABELS } from '../lib/setting-labels';

interface ImageSettingFieldProps {
  settingKey: string;
  value: string | null;
  onChange: (key: string, val: string | null) => void;
}

export function ImageSettingField({ settingKey, value, onChange }: ImageSettingFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const label = SETTING_LABELS[settingKey] || settingKey;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'settings');

    try {
      const response = await apiClient.post('/admin/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(settingKey, response.data.data.url);
      toast.success('تم الرفع بنجاح. تذكر الحفظ لتأكيد التغيير.');
    } catch (error) {
      toast.error('فشل رفع الصورة');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange(settingKey, null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative h-24 w-24 rounded-md border border-border bg-muted overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={label} className="h-full w-full object-contain" />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm hover:opacity-90"
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="h-24 w-24 rounded-md border border-dashed flex flex-col items-center justify-center text-muted-foreground bg-muted/30">
            <Upload className="h-6 w-6 mb-1 opacity-50" />
            <span className="text-[10px]">لا توجد صورة</span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري الرفع...
              </>
            ) : (
              'رفع صورة جديدة'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
