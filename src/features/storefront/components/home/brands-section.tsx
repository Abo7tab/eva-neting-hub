'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Brand } from '@/features/brands/types/brand.types';

interface BrandsSectionProps {
  title: string;
  hook: () => { data?: Brand[]; isLoading: boolean; isError: boolean };
}

export const BrandsSection = ({ title, hook }: BrandsSectionProps) => {
  const { data: brands, isLoading, isError } = hook();

  if (isError) return null;
  if (!isLoading && (!brands || brands.length === 0)) return null;

  return (
    <section className="py-8">
      {/* Section Title */}
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 text-center mb-4">{title}</h2>
        <div
          className="h-1.5 w-24 rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--eva-primary, #F97316), var(--eva-secondary, #EA580C))' }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/2] bg-white rounded-3xl shadow-sm border border-slate-50 animate-pulse"
              />
            ))
          : brands!.slice(0, 12).map((brand, i) => (
              <motion.div
                key={brand.uuid}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="aspect-[3/2] bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-50 flex items-center justify-center p-6 cursor-pointer group transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle gradient glow on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, var(--eva-primary,#F97316), transparent)' }}
                />

                {brand.logo_url ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={brand.logo_url}
                      alt={brand.name}
                      fill
                      className="object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    />
                  </div>
                ) : (
                  <span className="font-black text-slate-400 group-hover:text-[var(--eva-primary,#F97316)] text-center text-lg transition-colors duration-300 relative z-10">
                    {brand.name}
                  </span>
                )}
              </motion.div>
            ))}
      </div>
    </section>
  );
};
