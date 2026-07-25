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
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-shadow duration-300 hover:shadow-2xl"
      style={{ '--hover-glow': 'color-mix(in srgb, var(--primary) 30%, transparent)' } as any}
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
              <div className="bg-primary text-primary-foreground text-xs font-black px-3 py-1.5 rounded-full shadow-md">
                خصم {discountPercent}%
              </div>
            )}
            {product.is_trending && (
              <div 
                className="bg-primary text-primary-foreground text-xs font-black px-3 py-1.5 rounded-full shadow-md"
              >
                الأكثر مبيعاً
              </div>
            )}
          </div>

          {/* Hover "Add to Cart" Slide-Up Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex justify-center bg-gradient-to-t from-black/60 to-transparent z-20">
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-primary-foreground font-bold text-sm shadow-lg bg-primary"
            >
              <ShoppingBag size={16} />
              أضف للسلة
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 bg-white">
          <h3 className="font-semibold text-slate-800 line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-1 mb-3 font-medium">
            {product.brand?.name || 'منتج أصلي'}
          </p>

          <div className="mt-auto flex items-end gap-2">
            <span className="text-xl font-black text-primary">
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
    </motion.div>
  );
};

export const ProductGridSkeleton = () => {
  const { ProductCardSkeleton } = require('./skeletons/product-card-skeleton');
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

