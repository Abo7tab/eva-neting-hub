'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export const PromotionalBanner = () => {
  return (
    <section className="py-4 container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl shadow-xl bg-slate-900"
      >
        {/* Generated Image Background */}
        <Image 
          src="/summer-banner.jpg" 
          alt="Summer Banner Background"
          fill
          className="object-cover object-center opacity-80"
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
        />
        
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        <div className="relative z-10 px-6 py-12 md:py-16 text-center flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
            عرض خاص بمناسبة الصيف ☀️
          </h3>
          <p className="text-white text-sm md:text-lg mb-8 max-w-xl drop-shadow-md font-medium">
            استمتعي بخصومات تصل إلى 50% على جميع منتجات العناية بالبشرة والشعر. لفترة محدودة فقط!
          </p>
          <Link href="/products" className="bg-white text-primary font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            تسوقي الآن
          </Link>
        </div>
      </motion.div>
    </section>
  );
};
