'use client';

import { motion } from 'framer-motion';
import { useStorefrontContext } from '@/features/storefront/components/providers/storefront-provider';
import { useFeaturedProducts, useTrendingProducts, usePublicCategories } from '@/features/storefront/hooks/use-storefront';
import { HeroSection } from '@/features/storefront/components/home/hero-section';
import { ProductCarouselSection } from '@/features/storefront/components/home/product-carousel-section';
import { CategoriesSection } from '@/features/storefront/components/home/categories-section';

import { AnimatedBackground } from '@/features/storefront/components/shared/animated-background';

export default function HomePage() {
  const { settings, isLoading } = useStorefrontContext();

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 space-y-24">
          <ProductCarouselSection 
            title={settings['content_home_featured_title'] || 'منتجات مميزة'}
            hook={useFeaturedProducts} 
          />

          <ProductCarouselSection 
            title={settings['content_home_trending_title'] || 'الأكثر مبيعاً'}
            hook={useTrendingProducts} 
          />

          <CategoriesSection 
            title={settings['content_home_categories_title'] || 'تسوق حسب القسم'}
            hook={usePublicCategories} 
          />
        </div>

        <HeroSection settings={settings} isLoading={isLoading} />
      </motion.div>
    </div>
  );
}
