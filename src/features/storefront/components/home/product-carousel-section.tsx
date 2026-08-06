'use client';

import { motion } from 'framer-motion';
import { ProductGridSkeleton } from '../shared/product-card';
import { HomeProductCard } from '../shared/home-product-card';
import { Product } from '@/features/products/types/product.types';
import Link from 'next/link';

interface ProductCarouselSectionProps {
  title: string;
  hook: () => { data?: Product[]; isLoading: boolean; isError: boolean };
}

export const ProductCarouselSection = ({ title, hook }: ProductCarouselSectionProps) => {
  const { data: products, isLoading, isError } = hook();

  if (isError) return null;

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
      ) : (!products || products.length === 0) ? (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
          <p className="text-slate-500 font-medium">لا توجد منتجات في هذا القسم حالياً.</p>
        </div>
      ) : (
        <div className="relative overflow-hidden -mx-4 lg:mx-0">
          <style jsx>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(50%); }
            }
            .animate-marquee {
              animation: marquee 30s linear infinite;
              /* Right-to-left scrolling means we translate positively towards the right in RTL layout if flex row is normal, wait:
                 In RTL, translateX(50%) moves the element to the right, which means the content slides left. 
                 Let's test this carefully. */
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="flex w-max animate-marquee gap-4 px-4 hover:[animation-play-state:paused]">
            {/* We duplicate the array to allow infinite seamless scrolling */}
            {[...products.slice(0, 10), ...products.slice(0, 10)].map((product, idx) => (
              <div
                key={`${product.uuid}-${idx}`}
                className="w-[160px] sm:w-[200px] lg:w-[240px] shrink-0"
              >
                <HomeProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
