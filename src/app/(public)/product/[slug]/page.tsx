'use client';

import { use, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, ChevronRight, ChevronLeft, ShieldCheck, Truck, X, Maximize2, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePublicProduct, useCheckout, usePublicProducts, usePublicCategories } from '@/features/storefront/hooks/use-storefront';
import { ProductCard, ProductGridSkeleton } from '@/features/storefront/components/shared/product-card';
import { useCartStore } from '@/features/storefront/store/use-cart-store';
import { toast } from 'sonner';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { data: product, isLoading } = usePublicProduct(resolvedParams.slug);

  // All categories — to find siblings under the same parent (gender)
  const { data: allCategories } = usePublicCategories();

  // Products from same sub-category
  const { data: sameCatProducts, isLoading: isRelatedLoading } = usePublicProducts({
    category_uuid: product?.category?.uuid,
    sort_by: 'popular',
    per_page: 12,
  }, !!product?.category?.uuid);

  // Find parent uuid (رجالي/حريمي) and sibling category uuids
  const parentUuid = useMemo(() => {
    if (!product?.category || !allCategories) return null;
    const currentCat = allCategories.find(c => c.uuid === product.category!.uuid);
    return currentCat?.parent_uuid ?? null;
  }, [product, allCategories]);

  const siblingCategoryUuids = useMemo(() => {
    if (!parentUuid || !allCategories) return [];
    return allCategories
      .filter(c => c.parent_uuid === parentUuid && c.uuid !== product?.category?.uuid)
      .map(c => c.uuid);
  }, [parentUuid, allCategories, product]);

  // Only fetch siblings if we have a parent but same-category products are not enough (less than 6)
  const sameCatCount = sameCatProducts?.data?.filter(p => p.uuid !== product?.uuid)?.length || 0;
  const needsMoreProducts = sameCatCount < 6;
  const firstSiblingUuid = siblingCategoryUuids[0];
  
  const { data: siblingProducts } = usePublicProducts({
    category_uuid: firstSiblingUuid,
    sort_by: 'popular',
    per_page: 12,
  }, !!firstSiblingUuid && needsMoreProducts);

  // Broad fallback: only fetch if siblings + same category are still less than 6
  const siblingCount = siblingProducts?.data?.filter(p => p.uuid !== product?.uuid)?.length || 0;
  const stillNeedsMore = (sameCatCount + siblingCount) < 6;
  const { data: broadFallback, isLoading: isFallbackLoading } = usePublicProducts({
    sort_by: 'popular',
    per_page: 12,
  }, stillNeedsMore);

  const addItem = useCartStore(state => state.addItem);
  const checkoutMutation = useCheckout();
  const router = useRouter();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

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
  // Build merged list: same-cat first, then siblings, then broad fallback
  const displayedSuggestions = useMemo(() => {
    if (!product) return [];
    const seen = new Set<string>([product.uuid]);
    const result: typeof product[] = [];
    const push = (arr: typeof product[] | undefined) => {
      (arr || []).forEach(p => {
        if (!seen.has(p.uuid) && result.length < 12) {
          seen.add(p.uuid);
          result.push(p);
        }
      });
    };
    push(sameCatProducts?.data);
    push(siblingProducts?.data);
    push(broadFallback?.data);
    return result;
  }, [product, sameCatProducts, siblingProducts, broadFallback]);

  const visibleSuggestions = showAll ? displayedSuggestions : displayedSuggestions.slice(0, 6);
  const isLoadingSuggestions = isRelatedLoading || (displayedSuggestions.length === 0 && isFallbackLoading);

  const sectionLabel = useMemo(() => {
    const sameCatCount = (sameCatProducts?.data || []).filter(p => p.uuid !== product?.uuid).length;
    if (sameCatCount >= 4) return 'منتجات من نفس القسم';
    if (parentUuid) return 'منتجات قد تعجبك';
    return 'منتجات مقترحة';
  }, [sameCatProducts, parentUuid, product]);

  const hasDiscount = product.compare_at_price && parseFloat(product.compare_at_price) > parseFloat(product.price);

  const handleAddToCart = () => {
    addItem({
      product_uuid: product.uuid,
      name: product.name,
      price: parseFloat(product.price),
      quantity,
      image: images[0]
    });
    toast.success('تمت الإضافة');
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
    <div className="container mx-auto px-4 py-4 pt-16">
      {/* SEO: Product Structured Data to force Google to index images */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": images,
            "description": product.short_description || product.description || product.name,
            "sku": product.sku || product.uuid,
            "brand": {
              "@type": "Brand",
              "name": product.brand?.name || "إيفا بيوتي هاب"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://eva-beauty-hub.vercel.app/product/${product.slug}`,
              "priceCurrency": "EGP",
              "price": product.price,
              "availability": "https://schema.org/InStock"
            }
          })
        }}
      />

      <button 
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold w-fit bg-white/50 px-3 py-1.5 rounded-sm backdrop-blur-sm border border-slate-100 shadow-sm text-sm"
      >
        <ChevronRight size={20} />
        الرجوع للتسوق
      </button>

      {/* Layout: image RIGHT, details LEFT in RTL */}
      <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
        
        {/* Image on right (RTL: shows visually on right side) */}
        <div className="w-full md:w-5/12 flex flex-col gap-3 md:order-2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[4/5] w-full rounded-sm overflow-hidden bg-slate-50 border border-slate-100 shadow-sm cursor-pointer group"
            onClick={() => setIsLightboxOpen(true)}
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
            
            {hasDiscount && (
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground font-bold px-3 py-1.5 rounded-full shadow-lg">
                تخفيض
              </div>
            )}
            
            <div className="absolute bottom-4 right-4 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 size={20} />
            </div>
          </motion.div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-14 h-14 rounded-sm overflow-hidden shrink-0 border-2 transition-all ${
                    activeImage === idx ? 'border-primary shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details - left side (RTL: visually left) */}
        <div className="w-full md:w-7/12 md:order-1 flex flex-col justify-center space-y-4">
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
            
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 leading-snug">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-primary" style={{ fontFamily: 'var(--font-montserrat, sans-serif)' }}>
                {product.price} <span className="text-sm" style={{ fontFamily: 'var(--font-tajawal, sans-serif)' }}>ج.م</span>
              </span>
              {hasDiscount && (
                <span className="text-base text-slate-400 line-through" style={{ fontFamily: 'var(--font-montserrat, sans-serif)' }}>
                  {product.compare_at_price} <span className="text-xs" style={{ fontFamily: 'var(--font-tajawal, sans-serif)' }}>ج.م</span>
                </span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-sm leading-relaxed"
          >
            {product.description || product.short_description}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100"
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
              className="flex-1 bg-primary text-primary-foreground font-bold py-3 px-6 rounded-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:opacity-90 text-sm"
            >
              <ShoppingCart size={18} />
              أضف للسلة
            </button>
            
            <button
              onClick={handleBuyNow}
              disabled={checkoutMutation.isPending}
              className="flex-1 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3 px-6 rounded-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-[#25D366]/20 text-sm"
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

      <section className="mt-8 border-t border-slate-100 pt-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-base font-bold text-slate-900">{sectionLabel}</h2>
        </div>

        {isLoadingSuggestions ? (
          <ProductGridSkeleton />
        ) : visibleSuggestions.length > 0 ? (
          <>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3"
            >
              {visibleSuggestions.map((item) => (
                <motion.div
                  key={item.uuid}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                >
                  <ProductCard product={item} />
                </motion.div>
              ))}
            </motion.div>

            {/* Show More / Show Less */}
            {displayedSuggestions.length > 6 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-2 px-6 py-2 text-sm font-bold text-primary border border-primary rounded-sm hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  {showAll ? 'عرض أقل' : `عرض المزيد (${displayedSuggestions.length - 6}+)`}
                  <ChevronDown size={16} className={`transition-transform ${showAll ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-sm border border-slate-100 bg-white/70 p-8 text-center text-slate-500">
            لا توجد اقتراحات متاحة حاليا
          </div>
        )}
      </section>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-10 cursor-zoom-out backdrop-blur-sm"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/50 hover:text-white transition-colors p-4 z-50"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(false);
              }}
            >
              <X size={36} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="relative w-full h-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl"
              onClick={() => setIsLightboxOpen(false)} // Clicking the image now closes it
            >
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                className="object-contain"
                sizes="100vw"
                quality={100}
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
