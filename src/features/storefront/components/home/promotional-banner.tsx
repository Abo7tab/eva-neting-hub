'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export const PromotionalBanner = () => {
  return (
    <section className="py-4 container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-xl"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 px-6 py-12 md:py-16 text-center flex flex-col items-center justify-center">
          <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">
            عرض خاص بمناسبة الصيف ☀️
          </h3>
          <p className="text-white/90 text-sm md:text-lg mb-8 max-w-xl drop-shadow">
            استمتعي بخصومات تصل إلى 50% على جميع منتجات العناية بالبشرة والشعر. لفترة محدودة فقط!
          </p>
          <Link href="/products" className="bg-white text-primary font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            تسوقي الآن
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-white/20 rounded-full blur-2xl"></div>
      </motion.div>
    </section>
  );
};
