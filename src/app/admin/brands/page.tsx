"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useBrands } from '@/features/brands/hooks/use-brands';
import { BrandCard } from '@/features/brands/components/brand-card';

export default function BrandsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Real world apps might debounce this, but for simplicity we pass it directly
  // or use local filtering if we fetched all
  const { data: paginatedBrands, isLoading, isError } = useBrands({ 
    search: searchTerm,
    per_page: 50 // Fetch up to 50 for grid view
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">البراندات</h1>
          <p className="text-sm text-slate-500 mt-1">إدارة البراندات والعلامات التجارية للمتجر</p>
        </div>
        <Button onClick={() => router.push('/admin/brands/new')} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          إضافة براند جديد
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative w-full max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="البحث عن براند..."
            className="pr-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-red-500">
          حدث خطأ أثناء تحميل البراندات. يرجى المحاولة مرة أخرى.
        </div>
      ) : !paginatedBrands?.data || paginatedBrands.data.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
          <div className="h-20 w-20 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-500">
            <Package className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد براندات بعد</h3>
          <p className="text-slate-500 mb-6 text-center max-w-sm">
            {searchTerm 
              ? "لم يتم العثور على براندات مطابقة للبحث." 
              : "لم تقم بإضافة أي علامة تجارية حتى الآن. ابدأ بإضافة البراند الأول لربطه بالمنتجات."}
          </p>
          <Button onClick={() => router.push('/admin/brands/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة براند جديد
          </Button>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedBrands.data.map((brand) => (
            <BrandCard key={brand.uuid} brand={brand} />
          ))}
        </div>
      )}
    </div>
  );
}
