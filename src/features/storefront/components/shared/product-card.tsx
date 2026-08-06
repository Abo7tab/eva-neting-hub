'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/features/products/types/product.types';
import { ProductCardSkeleton } from './skeletons/product-card-skeleton';
import { useCartStore } from '../../store/use-cart-store';
import { toast } from 'sonner';
import type { CSSProperties } from 'react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      product_uuid: product.uuid,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
      image: product.cover_image_url || '/placeholder.png',
    });
    toast.success('تمت الإضافة');
  };

  const hasDiscount = product.compare_at_price && parseFloat(product.compare_at_price) > parseFloat(product.price);
  const discountPercent = hasDiscount
    ? Math.round(((parseFloat(product.compare_at_price!) - parseFloat(product.price)) / parseFloat(product.compare_at_price!)) * 100)
    : 0;

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative flex flex-col bg-white rounded-sm shadow-sm border border-slate-100 overflow-hidden transition-shadow duration-300 hover:shadow-2xl"
      style={{ '--hover-glow': 'color-mix(in srgb, var(--primary) 30%, transparent)' } as CSSProperties}
    >
      <style jsx>{`
        .group:hover {
          box-shadow: 0 25px 50px -12px var(--hover-glow);
        }
      `}</style>
      
      <Link href={`/product/${product.slug}`} className="flex-1 flex flex-col relative z-10">
        
        {/* Image Wrapper */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
          <Image
            src={product.cover_image_url || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          
          {/* Top Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
            {hasDiscount && (
              <div className="bg-primary text-primary-foreground text-xs font-black px-2 py-1 rounded-sm shadow-md">
                خصم {discountPercent}%
              </div>
            )}
            {product.is_trending && (
              <div 
                className="bg-primary text-primary-foreground text-xs font-black px-2 py-1 rounded-sm shadow-md"
              >
                الأكثر مبيعاً
              </div>
            )}
          </div>

          {/* Hover "Add to Cart" Slide-Up Overlay (Desktop Only) */}
          <div className="hidden lg:flex absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 justify-center bg-gradient-to-t from-black/60 to-transparent z-20">
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-sm text-primary-foreground font-bold text-sm shadow-lg bg-primary"
            >
              <ShoppingBag size={16} />
              أضف للسلة
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 bg-white">
          <h3 className="font-semibold text-sm sm:text-base text-slate-800 line-clamp-2 mb-1 group-hover:text-primary transition-colors" title={product.name}>
            {product.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 mb-2 sm:mb-3 font-medium">
            {product.brand?.name || 'منتج أصلي'}
          </p>

          <div className="mt-auto flex items-center justify-between">
            {/* Price block - Eva style: new price + old price side by side */}
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span
                  className="text-base sm:text-lg font-bold text-primary leading-tight"
                  style={{ fontFamily: 'var(--font-montserrat, sans-serif)' }}
                >
                  {parseFloat(product.price).toFixed(2)}
                  <span className="text-[9px] sm:text-[10px] font-semibold mr-0.5" style={{ fontFamily: 'var(--font-tajawal, sans-serif)' }}> ج.م</span>
                </span>
                {hasDiscount && (
                  <span
                    className="text-[10px] sm:text-xs text-slate-400 line-through"
                    style={{ fontFamily: 'var(--font-montserrat, sans-serif)' }}
                  >
                    {parseFloat(product.compare_at_price!).toFixed(2)}
                    <span className="text-[9px]" style={{ fontFamily: 'var(--font-tajawal, sans-serif)' }}> ج.م</span>
                  </span>
                )}
              </div>
            </div>
            
            {/* Mobile Add to Cart Button (Visible on all sizes, but mainly for mobile) */}
            <button
              onClick={handleAddToCart}
              className="lg:hidden flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors shrink-0"
              aria-label="أضف للسلة"
            >
              <ShoppingBag size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const ProductGridSkeleton = () => {
  return (
    <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 gap-4 md:gap-6 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="w-[75vw] sm:w-[45vw] shrink-0 snap-center lg:w-auto">
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  );
};
