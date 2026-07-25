'use client';

import { motion } from 'framer-motion';
import { ProductCard, ProductGridSkeleton } from '../shared/product-card';
import { Product } from '@/features/products/types/product.types';
import Link from 'next/link';

interface ProductCarouselSectionProps {
  title: string;
  hook: () => { data?: Product[]; isLoading: boolean; isError: boolean };
}

export const ProductCarouselSection = ({ title, hook }: ProductCarouselSectionProps) => {
  const { data: products, isLoading, isError } = hook();

  if (isError) return null;
  if (!isLoading && (!products || products.length === 0)) return null;

  return (
    <section className="py-16 container mx-auto px-4">
      {/* Title & Underline */}
      <div className="flex flex-col items-start mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{title}</h2>
        <div
          className="h-1 w-20 rounded-full bg-primary" 
        />
      </div>

      {isLoading ? (
        <ProductGridSkeleton />
      ) : (
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          // Mobile: Horizontal Scroll (snap), Desktop: Grid 4 cols
          className="flex overflow-x-auto pb-8 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 gap-4 md:gap-6 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0"
        >
          {products!.slice(0, 8).map((product) => (
            <div
              key={product.uuid}
              className="w-[75vw] sm:w-[45vw] shrink-0 snap-center lg:w-auto"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </motion.div>
      )}
    </section>
  );
};
