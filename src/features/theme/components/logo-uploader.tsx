'use client';

import { useState, useRef } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { ImagePlus, Trash2, Loader2 } from 'lucide-react';
import { useUploadLogo } from '../hooks/use-theme';

interface LogoUploaderProps {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}

export function LogoUploader({ label, value, onChange, disabled }: LogoUploaderProps) {
  const uploadMutation = useUploadLogo();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        onChange(data.url);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    });
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {value ? (
        <div className="relative w-48 h-24 border rounded-md overflow-hidden bg-muted flex items-center justify-center group">
          <img src={value} alt="Logo Preview" className="max-w-full max-h-full object-contain p-2" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onChange(null)}
              disabled={disabled || uploadMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="w-48 h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => !disabled && !uploadMutation.isPending && fileInputRef.current?.click()}
        >
          {uploadMutation.isPending ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <ImagePlus className="h-6 w-6 mb-2" />
              <span className="text-sm">رفع صورة</span>
            </>
          )}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled || uploadMutation.isPending}
      />
    </div>
  );
}
