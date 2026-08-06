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

      <div className="container mx-auto px-4 pt-16 relative z-10">
        <h1 className="text-lg font-bold text-slate-700 mb-4">كل الأقسام</h1>

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
