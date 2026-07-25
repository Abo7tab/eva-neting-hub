'use client';

import { use, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard, ProductGridSkeleton } from '@/features/storefront/components/shared/product-card';
import { usePublicCategory, usePublicProducts, usePublicBrands } from '@/features/storefront/hooks/use-storefront';
import { Filter, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { data: category, isLoading: isCategoryLoading } = usePublicCategory(resolvedParams.slug);
  const { data: productsData, isLoading: isProductsLoading } = usePublicProducts({
    category_uuid: category?.uuid,
    brand_uuid: selectedBrand,
    sort_by: sortBy,
  });
  const { data: brandsData } = usePublicBrands();

  const isLoading = isCategoryLoading || (isProductsLoading && !productsData);
  const productCount = productsData?.data?.length ?? 0;

  const sortLabel = sortBy === 'newest' ? 'الأحدث' :
    sortBy === 'price_asc' ? 'السعر: الأقل أولاً' :
    sortBy === 'price_desc' ? 'السعر: الأعلى أولاً' : 'الأكثر شعبية';

  const FilterSidebar = () => (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <h3 className="font-black text-slate-800 mb-5 text-base border-b border-slate-100 pb-3">
        تصفية المنتجات
      </h3>
      <div className="space-y-4">
        <h4 className="font-bold text-slate-600 text-sm uppercase tracking-wider">الماركة</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <label className="flex items-center gap-3 cursor-pointer group py-1.5 px-2 rounded-xl hover:bg-slate-50 transition-colors">
            <input
              type="radio"
              name="brand-filter"
              className="w-4 h-4 border-slate-300"
              style={{ accentColor: 'var(--eva-primary, #F97316)' }}
              checked={!selectedBrand}
              onChange={() => setSelectedBrand(undefined)}
            />
            <span className="text-slate-700 font-medium text-sm group-hover:text-slate-900 transition-colors">الكل</span>
          </label>
          {brandsData?.map(brand => (
            <label key={brand.uuid} className="flex items-center gap-3 cursor-pointer group py-1.5 px-2 rounded-xl hover:bg-slate-50 transition-colors">
              <input
                type="radio"
                name="brand-filter"
                value={brand.uuid}
                checked={selectedBrand === brand.uuid}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-4 h-4 border-slate-300"
                style={{ accentColor: 'var(--eva-primary, #F97316)' }}
              />
              <span className="text-slate-700 font-medium text-sm group-hover:text-slate-900 transition-colors">{brand.name}</span>
            </label>
          ))}
        </div>
        {selectedBrand && (
          <button
            onClick={() => setSelectedBrand(undefined)}
            className="w-full text-center text-sm font-bold py-2 rounded-xl transition-colors"
            style={{ color: 'var(--eva-primary, #F97316)' }}
          >
            مسح الفلتر
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      <div className="container mx-auto px-4 py-8">

        {/* Page header strip */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {isCategoryLoading ? (
              <div className="h-7 w-32 bg-slate-200 rounded animate-pulse" />
            ) : (
              <h1 className="text-2xl font-black text-slate-800">
                {category?.name || resolvedParams.slug}
              </h1>
            )}
            <p className="text-sm text-slate-500 mt-0.5">
              {isLoading ? '...' : `${productCount} منتج`}
            </p>
          </div>

          {/* Mobile filter toggle */}
          <button
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border border-slate-200 bg-white shadow-sm"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <SlidersHorizontal size={16} style={{ color: 'var(--eva-primary, #F97316)' }} />
            <span style={{ color: 'var(--eva-primary, #F97316)' }}>فلترة</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100 mb-6">
              <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                <Filter size={16} style={{ color: 'var(--eva-primary, #F97316)' }} />
                <span>ترتيب حسب:</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold outline-none border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors" style={{ color: 'var(--eva-primary, #F97316)' }}>
                  {sortLabel}
                  <ChevronDown size={14} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-xl">
                  {(['newest', 'popular', 'price_asc', 'price_desc'] as const).map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => setSortBy(s)}
                      className={sortBy === s ? 'font-bold' : ''}
                      style={sortBy === s ? { backgroundColor: 'var(--eva-primary, #F97316)15', color: 'var(--eva-primary, #F97316)' } : {}}
                    >
                      {s === 'newest' ? 'الأحدث' : s === 'popular' ? 'الأكثر شعبية' : s === 'price_asc' ? 'السعر: الأقل أولاً' : 'السعر: الأعلى أولاً'}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <ProductGridSkeleton />
            ) : productCount === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-100">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter size={40} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-700 mb-2">لا توجد منتجات</h3>
                <p className="text-slate-500 max-w-xs mx-auto text-sm">جرب تغيير خيارات التصفية</p>
                {selectedBrand && (
                  <button
                    onClick={() => setSelectedBrand(undefined)}
                    className="mt-4 text-sm font-bold px-5 py-2 rounded-xl transition-colors text-white"
                    style={{ backgroundColor: 'var(--eva-primary, #F97316)' }}
                  >
                    عرض الكل
                  </button>
                )}
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {productsData?.data.map((product) => (
                  <ProductCard key={product.uuid} product={product} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 max-w-full bg-white z-50 shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-black text-slate-800 text-lg">تصفية المنتجات</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 rounded-xl hover:bg-slate-100">
                  <X size={20} className="text-slate-600" />
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar />
              </div>
              <div className="p-4 border-t">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 rounded-2xl font-black text-white text-base"
                  style={{ backgroundColor: 'var(--eva-primary, #F97316)' }}
                >
                  عرض النتائج ({productCount})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
