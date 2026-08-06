'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/features/products/types/product.types';

interface HomeProductCardProps {
  product: Product;
}

export const HomeProductCard = ({ product }: HomeProductCardProps) => {
  const hasDiscount = product.compare_at_price && parseFloat(product.compare_at_price) > parseFloat(product.price);
  const discountPercent = hasDiscount
    ? Math.round(((parseFloat(product.compare_at_price!) - parseFloat(product.price)) / parseFloat(product.compare_at_price!)) * 100)
    : 0;

  return (
    <Link href={`/product/${product.slug}`} className="block relative group w-full overflow-hidden rounded-2xl shadow-sm border border-slate-100 bg-white">
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="w-full relative aspect-[4/5]"
      >
        <Image
          src={product.cover_image_url || '/placeholder.png'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />

        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10 flex items-center">
            {discountPercent}% خصم
          </div>
        )}

        {/* Price Tag (Pink) */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="bg-primary text-primary-foreground font-bold text-sm md:text-base px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
            {parseFloat(product.price).toFixed(2)} ج.م
          </div>
          
          {hasDiscount && (
            <span className="text-white/80 line-through text-xs font-medium bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
              {parseFloat(product.compare_at_price!).toFixed(2)} ج.م
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
};
