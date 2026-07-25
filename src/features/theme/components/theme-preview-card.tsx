'use client';

import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import type { ThemeConfig } from '../types/theme.types';

interface ThemePreviewCardProps {
  config: ThemeConfig;
}

export function ThemePreviewCard({ config }: ThemePreviewCardProps) {
  return (
    <Card className="p-6 border-dashed border-2 bg-slate-50 flex flex-col items-center space-y-8 h-full">
      
      {/* Header / Logo */}
      <div className="w-full flex justify-center pb-4 border-b">
        {config.logo_url ? (
          <img src={config.logo_url} alt="Logo" className="h-12 object-contain" />
        ) : (
          <div className="h-12 flex items-center justify-center font-bold text-xl tracking-tight" style={{ color: config.primary_color }}>
            Gomla Beauty
          </div>
        )}
      </div>

      {/* Typography Preview */}
      <div className="text-center space-y-3 w-full" style={{ color: config.text_color }}>
        <h1 className="text-3xl font-bold">العناية بالبشرة</h1>
        <p className="opacity-80">
          اكتشفي مجموعتنا الجديدة من المنتجات الطبيعية للحصول على بشرة نضرة ومشرقة.
        </p>
      </div>

      {/* Buttons Preview */}
      <div className="flex gap-4">
        <Button 
          className="shadow-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: config.primary_color, color: '#fff' }}
        >
          أضف للسلة
        </Button>
        <Button 
          variant="outline"
          style={{ borderColor: config.secondary_color, color: config.text_color }}
          className="bg-white hover:bg-slate-50"
        >
          عرض التفاصيل
        </Button>
      </div>

      {/* Product Card Mockup */}
      <div className="w-full max-w-sm rounded-xl overflow-hidden shadow-lg bg-white p-4 space-y-4">
        <div 
          className="w-full h-40 rounded-lg flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: config.accent_color }}
        >
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <span className="text-slate-800 font-medium z-10">صورة المنتج</span>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg" style={{ color: config.text_color }}>سيروم فيتامين سي</h3>
            <p className="text-sm font-bold mt-1" style={{ color: config.primary_color }}>450 ج.م</p>
          </div>
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105 shadow-sm"
            style={{ backgroundColor: config.primary_color }}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}
