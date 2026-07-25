'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Category } from '@/features/categories/types/category.types';
import { CategoryGridSkeleton } from '../shared/skeletons/category-card-skeleton';
import Image from 'next/image';

interface CategoriesSectionProps {
  title: string;
  hook: () => { data?: Category[]; isLoading: boolean; isError: boolean };
}

export const CategoriesSection = ({ title, hook }: CategoriesSectionProps) => {
  const { data: allCategories, isLoading, isError } = hook();

  if (isError) return null;
  
  // Spec: Fetch parent categories (parent_uuid is null)
  const categories = allCategories?.filter(c => !c.parent_uuid) || [];

  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="py-16 container mx-auto px-4">
      {/* Title & Underline */}
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{title}</h2>
        <div 
          className="h-1 w-20 rounded-full bg-primary"
        />
      </div>

      {isLoading ? (
        <CategoryGridSkeleton />
      ) : (
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {categories.slice(0, 6).map((cat, index) => {
              // Generate a chic fallback gradient if no image is present
              const fallbackGradients = [
                'from-rose-100 to-teal-100',
                'from-indigo-100 to-purple-100',
                'from-orange-100 to-rose-100',
                'from-blue-100 to-cyan-100'
              ];
              const gradientClass = fallbackGradients[index % fallbackGradients.length];

              return (
                <motion.div
                  key={cat.uuid}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="group block w-full"
                >
                  <Link href={`/category/${cat.slug}`} className="block w-full h-full">
                    <div className="relative w-full h-[320px] md:h-[420px] rounded-[2rem] overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
                      
                      {/* Background (Image or Chic Gradient) */}
                      {cat.cover_image_url ? (
                        <Image
                          src={cat.cover_image_url}
                          alt={cat.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradientClass} group-hover:scale-110 transition-transform duration-700 ease-out`} />
                      )}

                      {/* Premium Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                      
                      {/* Badge */}
                      {cat.products_count !== undefined && (
                        <div className="absolute top-6 left-6 z-10 bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold px-4 py-1.5 rounded-full">
                          {cat.products_count} منتج
                        </div>
                      )}

                      {/* Content */}
                      <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center justify-end text-center z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <h3 className="font-black text-3xl md:text-4xl text-white mb-3 tracking-wide drop-shadow-md">
                          {cat.name}
                        </h3>
                        <div className="w-0 h-1 bg-primary mx-auto group-hover:w-16 transition-all duration-500 ease-out rounded-full" />
                      </div>
                      
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
      )}
    </section>
  );
};


