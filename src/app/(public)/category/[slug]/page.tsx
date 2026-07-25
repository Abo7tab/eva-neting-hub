'use client';

import { use, useState } from 'react';
import { motion } from 'framer-motion';
import { ProductCard, ProductGridSkeleton } from '@/features/storefront/components/shared/product-card';
import { AnimatedBackground } from '@/features/storefront/components/shared/animated-background';
import { usePublicCategory, usePublicProducts, usePublicBrands } from '@/features/storefront/hooks/use-storefront';
import { Filter, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'popular'>('newest');

  const [selectedBrand, setSelectedBrand] = useState<string | undefined>();
  const { data: category, isLoading: isCategoryLoading } = usePublicCategory(resolvedParams.slug);
  const { data: productsData, isLoading: isProductsLoading } = usePublicProducts({
    category_uuid: category?.uuid,
    brand_uuid: selectedBrand,
    sort_by: sortBy,
  });
  
  // Since we don't have a specific endpoint for brands within a category, we fetch all public brands for the filter.
  // In a real app, this might be filtered by the current category.
  const { data: brandsData } = usePublicBrands();

  const isLoading = isCategoryLoading || (isProductsLoading && !productsData);

  return (
    <div className="relative min-h-screen pb-20">
      <AnimatedBackground />

      <div className="container mx-auto px-4 pt-10 relative z-10">


        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 shrink-0">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="font-black text-slate-800 mb-6 text-lg border-b border-slate-100 pb-4">تصفية المنتجات</h3>
              
              <div className="space-y-4">
                <h4 className="font-bold text-slate-700">الماركة</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="brand" 
                      className="w-4 h-4 text-(--color-primary) focus:ring-(--color-primary) border-slate-300"
                      checked={!selectedBrand}
                      onChange={() => setSelectedBrand(undefined)}
                    />
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">الكل</span>
                  </label>
                  {brandsData?.map(brand => (
                    <label key={brand.uuid} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="brand"
                        value={brand.uuid}
                        checked={selectedBrand === brand.uuid}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="w-4 h-4 text-(--color-primary) focus:ring-(--color-primary) border-slate-300"
                      />
                      <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Filters Bar */}
            <div className="flex items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-100 mb-8">
              <div className="flex items-center gap-2 text-slate-600 font-bold">
                <Filter size={20} className="text-(--color-primary)" />
                <span>الترتيب</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl text-slate-700 transition-colors font-bold outline-none border border-slate-200">
                  {
                    sortBy === 'newest' ? 'الأحدث' :
                    sortBy === 'price_asc' ? 'السعر (من الأقل للأعلى)' :
                    sortBy === 'price_desc' ? 'السعر (من الأعلى للأقل)' : 'الأكثر شعبية'
                  }
                  <ChevronDown size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuItem onClick={() => setSortBy('newest')} className={sortBy === 'newest' ? 'bg-slate-100 font-bold' : ''}>الأحدث</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('popular')} className={sortBy === 'popular' ? 'bg-slate-100 font-bold' : ''}>الأكثر شعبية</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('price_asc')} className={sortBy === 'price_asc' ? 'bg-slate-100 font-bold' : ''}>السعر (من الأقل للأعلى)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('price_desc')} className={sortBy === 'price_desc' ? 'bg-slate-100 font-bold' : ''}>السعر (من الأعلى للأقل)</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <ProductGridSkeleton />
            ) : productsData?.data.length === 0 ? (
              <div className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mb-6">
                  <Filter size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-700 mb-2">لا توجد منتجات</h3>
                <p className="text-slate-500 max-w-md">لم يتم العثور على منتجات تطابق خيارات التصفية الحالية. جرب تغيير خيارات التصفية أو الماركة.</p>
                {selectedBrand && (
                  <button 
                    onClick={() => setSelectedBrand(undefined)}
                    className="mt-6 text-(--color-primary) font-bold hover:underline"
                  >
                    عرض كل المنتجات
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {productsData?.data.map((product, i) => (
                  <motion.div
                    key={product.uuid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: (i % 8) * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
