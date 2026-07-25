'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/features/products/types/product.types';
import { useCartStore } from '../../store/use-cart-store';
import { toast } from 'sonner';

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
    toast.success('تمت الإضافة للسلة', {
      description: product.name,
    });
  };

  const hasDiscount = product.compare_at_price && parseFloat(product.compare_at_price) > parseFloat(product.price);
  const discountPercent = hasDiscount
    ? Math.round(((parseFloat(product.compare_at_price!) - parseFloat(product.price)) / parseFloat(product.compare_at_price!)) * 100)
    : 0;

  return (
    <div 
      className="group relative flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
      style={{ '--hover-glow': 'color-mix(in srgb, var(--eva-primary) 30%, transparent)' } as any}
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
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
            {hasDiscount && (
              <div className="bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md">
                خصم {discountPercent}%
              </div>
            )}
            {product.is_trending && (
              <div 
                className="text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md"
                style={{ backgroundColor: 'var(--eva-primary, #F97316)' }}
              >
                الأكثر مبيعاً
              </div>
            )}
          </div>

          {/* Hover "Add to Cart" Slide-Up Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex justify-center bg-gradient-to-t from-black/60 to-transparent z-20">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-bold text-sm shadow-lg hover:scale-105 transition-transform"
              style={{ backgroundColor: 'var(--eva-primary, #F97316)' }}
            >
              <ShoppingBag size={16} />
              أضف للسلة
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 bg-white">
          <h3 className="font-semibold text-slate-800 line-clamp-1 mb-1 group-hover:text-[var(--eva-primary,#F97316)] transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-1 mb-3 font-medium">
            {product.brand?.name || 'منتج أصلي'}
          </p>

          <div className="mt-auto flex items-end gap-2">
            <span className="text-xl font-black" style={{ color: 'var(--eva-primary, #F97316)' }}>
              {product.price} <span className="text-xs font-bold">ج.م</span>
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through mb-1">
                {product.compare_at_price} ج.م
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export const ProductGridSkeleton = () => (
  <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 gap-4 md:gap-6 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
    {[1,2,3,4].map(i => (
      <div key={i} className="w-[75vw] sm:w-[45vw] shrink-0 snap-center lg:w-auto flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
        {/* Shimmer */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent z-10" />
        
        <div className="w-full aspect-square bg-slate-100 animate-pulse" />
        <div className="p-4 flex flex-col gap-3">
          <div className="h-4 bg-slate-100 rounded-lg animate-pulse w-3/4" />
          <div className="h-3 bg-slate-100 rounded-lg animate-pulse w-1/3" />
          <div className="h-6 bg-slate-100 rounded-lg animate-pulse w-1/2 mt-2" />
        </div>
      </div>
    ))}
  </div>
);
