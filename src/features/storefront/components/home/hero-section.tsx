'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { Shield, Truck, RotateCcw, Star } from 'lucide-react';

interface HeroSectionProps {
  settings: Record<string, string | null>;
  isLoading?: boolean;
}

const TRUST_ITEMS = [
  { icon: Shield, text: 'منتجات أصلية 100%' },
  { icon: Truck, text: 'توصيل سريع' },
  { icon: RotateCcw, text: 'استرجاع 14 يوم' },
  { icon: Star, text: 'آلاف العملاء' },
];

export const HeroSection = ({ settings, isLoading }: HeroSectionProps) => {
  if (isLoading) return <HeroSkeleton />;

  const siteName = settings['site_name'] || 'إيفا نيتنج هاب';
  const title = settings['content_home_hero_title_default_ar'] || 'اكتشفي عالمك من الجمال الأصيل';
  const subtitle = settings['content_home_hero_subtitle_default_ar'] || 'أكبر تشكيلة من منتجات التجميل الأصلية بأسعار لا تُقاوم';

  // Container variants for staggering children
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 pt-20">
      
      {/* Content wrapper */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center mt-10"
      >
        
        {/* Animated Badge */}
        <motion.div
          variants={item}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white font-bold text-sm mb-8 shadow-lg"
          style={{ backgroundColor: 'var(--eva-primary, #F97316)' }}
        >
          <Star size={16} fill="currentColor" />
          مرحباً بك في {siteName}
        </motion.div>

        {/* Title */}
        <motion.h1 
          variants={item}
          className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-slate-900"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={item}
          className="text-lg md:text-2xl text-slate-600 mb-12 max-w-3xl leading-relaxed"
        >
          {subtitle}
        </motion.p>

        {/* Buttons */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4 mb-20">
          <Link href="/products">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-xl text-white font-bold text-lg shadow-xl"
              style={{ 
                backgroundColor: 'var(--eva-primary, #F97316)',
                boxShadow: '0 10px 25px -5px color-mix(in srgb, var(--eva-primary) 50%, transparent)'
              }}
            >
              تسوقي الآن
            </motion.button>
          </Link>
          
          <Link href="/categories">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-xl font-bold text-lg border-2 bg-white/50 backdrop-blur-sm"
              style={{ 
                borderColor: 'var(--eva-primary, #F97316)',
                color: 'var(--eva-primary, #F97316)'
              }}
            >
              تصفح الأقسام
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          variants={item}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
        >
          {TRUST_ITEMS.map(({ icon: Icon, text }, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + (i * 0.1), duration: 0.5 }}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/70 backdrop-blur-md shadow-sm border border-white"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: 'color-mix(in srgb, var(--eva-primary) 15%, transparent)' }}
              >
                <Icon size={24} style={{ color: 'var(--eva-primary, #F97316)' }} />
              </div>
              <span className="font-bold text-slate-700 text-sm">{text}</span>
            </motion.div>
          ))}
        </motion.div>

      </motion.div>
    </section>
  );
};

export const HeroSkeleton = () => (
  <section className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 pt-20">
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center mt-10">
      <div className="h-10 w-48 bg-slate-200 animate-pulse rounded-full mb-8" />
      <div className="h-20 w-3/4 bg-slate-200 animate-pulse rounded-2xl mb-6" />
      <div className="h-8 w-1/2 bg-slate-200 animate-pulse rounded-full mb-12" />
      <div className="flex gap-4 mb-20">
        <div className="h-14 w-40 bg-slate-200 animate-pulse rounded-xl" />
        <div className="h-14 w-40 bg-slate-200 animate-pulse rounded-xl" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  </section>
);
