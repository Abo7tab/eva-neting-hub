'use client';

import { use, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Share2, Heart, Check, ChevronRight, ChevronLeft, ShieldCheck, Truck } from 'lucide-react';
import { usePublicProduct, useCheckout } from '@/features/storefront/hooks/use-storefront';
import { useCartStore } from '@/features/storefront/store/use-cart-store';
import { toast } from 'sonner';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { data: product, isLoading } = usePublicProduct(resolvedParams.slug);
  const addItem = useCartStore(state => state.addItem);
  const checkoutMutation = useCheckout();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 pt-24">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="aspect-square bg-slate-100 animate-pulse rounded-3xl" />
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-slate-100 animate-pulse rounded-xl" />
              <div className="w-20 h-20 bg-slate-100 animate-pulse rounded-xl" />
              <div className="w-20 h-20 bg-slate-100 animate-pulse rounded-xl" />
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <div className="h-10 bg-slate-100 animate-pulse rounded w-3/4" />
            <div className="h-8 bg-slate-100 animate-pulse rounded w-1/4" />
            <div className="space-y-3">
              <div className="h-4 bg-slate-100 animate-pulse rounded w-full" />
              <div className="h-4 bg-slate-100 animate-pulse rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="text-center py-20">المنتج غير موجود</div>;

  const images = [
    product.cover_image_url || '/placeholder.png',
    ...(product.images?.map(i => i.image_url) || [])
  ];

  const handleAddToCart = () => {
    addItem({
      product_uuid: product.uuid,
      name: product.name,
      price: parseFloat(product.price),
      quantity,
      image: images[0]
    });
    toast.success('تم الإضافة بنجاح', { description: product.name });
  };

  const handleBuyNow = () => {
    checkoutMutation.mutate({
      items: [{ product_uuid: product.uuid, quantity }]
    }, {
      onSuccess: (data) => {
        window.open(data.whatsapp_url, '_blank');
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-10 pt-24">
      <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
        
        {/* Images Gallery */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            
            {product.compare_at_price && (
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground font-bold px-3 py-1.5 rounded-full shadow-lg">
                تخفيض
              </div>
            )}
          </motion.div>

          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImage === idx ? 'border-primary shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {product.brand && (
              <span className="text-primary font-bold text-sm tracking-wider uppercase">
                {product.brand.name}
              </span>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-end gap-4">
              <span className="text-4xl font-black text-primary">
                {product.price} ج.م
              </span>
              {product.compare_at_price && (
                <span className="text-2xl text-slate-400 line-through mb-1">
                  {product.compare_at_price} ج.م
                </span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prose prose-slate max-w-none text-slate-600 text-lg"
          >
            {product.description || product.short_description}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100"
          >
            <div className="flex items-center justify-between sm:justify-start bg-slate-50 rounded-2xl p-2 border border-slate-200">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              <span className="w-12 text-center font-bold text-xl">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-primary-foreground font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:opacity-90"
            >
              <ShoppingCart size={20} />
              أضف للسلة
            </button>
            
            <button
              onClick={handleBuyNow}
              disabled={checkoutMutation.isPending}
              className="flex-1 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-[#25D366]/20"
            >
              {checkoutMutation.isPending ? 'جاري التحويل...' : 'اطلب عبر واتساب'}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100"
          >
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <span className="font-bold text-sm">منتجات أصلية 100%</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <span className="font-bold text-sm">توصيل سريع</span>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
