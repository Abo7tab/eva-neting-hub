'use client';

import { useState, use } from 'react';
import { motion } from 'framer-motion';
import { ProductCard, ProductGridSkeleton } from '@/features/storefront/components/shared/product-card';
import { AnimatedBackground } from '@/features/storefront/components/shared/animated-background';
import { usePublicInfiniteProducts } from '@/features/storefront/hooks/use-storefront';
import { Search, Filter, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const initialQuery = resolvedSearchParams.q || '';
  const [search, setSearch] = useState(initialQuery);
  const [debouncedSearch, setDebouncedSearch] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'popular'>('newest');

  // Simple debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setTimeout(() => setDebouncedSearch(e.target.value), 500);
  };

  const { data: infiniteData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = usePublicInfiniteProducts({
    search: debouncedSearch,
    sort_by: sortBy,
  });

  const allProducts = infiniteData?.pages.flatMap(page => page.data) || [];

  return (
    <div className="relative min-h-screen pb-20">
      <AnimatedBackground />

      <div className="container mx-auto px-4 pt-10 relative z-10">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-slate-100 p-8 mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4">
              كل المنتجات
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              تصفحي تشكيلتنا الواسعة من أفضل منتجات التجميل والعناية.
            </p>
          </motion.div>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={search}
              onChange={handleSearchChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-4 py-3 rounded-xl text-slate-700 transition-colors font-bold outline-none w-full md:w-auto justify-center">
              <Filter size={18} />
              الترتيب: {
                sortBy === 'newest' ? 'الأحدث' :
                sortBy === 'price_asc' ? 'السعر (من الأقل للأعلى)' :
                sortBy === 'price_desc' ? 'السعر (من الأعلى للأقل)' : 'الأكثر شعبية'
              }
              <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
        ) : allProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-600 mb-2">لا توجد منتجات</h3>
            <p className="text-slate-500">جربي البحث بكلمات أخرى.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {allProducts.map((product, i) => (
                <motion.div
                  key={product.uuid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (i % 10) * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {hasNextPage && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-8 py-3 bg-white text-slate-700 hover:text-(--color-primary) font-bold rounded-xl shadow-sm border border-slate-200 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {isFetchingNextPage ? (
                    <>
                      <span className="w-5 h-5 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin"></span>
                      جاري التحميل...
                    </>
                  ) : (
                    'عرض المزيد'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
