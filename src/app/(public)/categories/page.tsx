'use client';

import { motion } from 'framer-motion';
import { CategoryCard, CategoryCardSkeleton } from '@/features/storefront/components/shared/category-card';
import { AnimatedBackground } from '@/features/storefront/components/shared/animated-background';
import { usePublicCategories } from '@/features/storefront/hooks/use-storefront';

export default function CategoriesPage() {
  const { data: categories, isLoading } = usePublicCategories();

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
              كل الأقسام
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              تصفحي الأقسام واختاري ما يناسبك بسهولة.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))
            : categories?.map((category, i) => (
                <CategoryCard key={category.uuid} category={category} index={i} />
              ))}
        </div>
      </div>
    </div>
  );
}
