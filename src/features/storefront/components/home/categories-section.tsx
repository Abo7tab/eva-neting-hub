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
          className="h-1 w-20 rounded-full" 
          style={{ backgroundColor: 'var(--eva-primary, #F97316)' }}
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
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {categories.slice(0, 8).map((cat) => (
            <motion.div
              key={cat.uuid}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Link href={`/category/${cat.slug}`} className="block">
                <div 
                  className="relative flex flex-col items-center p-4 bg-white rounded-3xl shadow-sm border border-slate-100 transition-all duration-300 group-hover:shadow-2xl"
                  style={{ '--hover-glow': 'color-mix(in srgb, var(--eva-primary) 30%, transparent)' } as any}
                >
                  <style jsx>{`
                    .group:hover > div {
                      box-shadow: 0 20px 40px -10px var(--hover-glow);
                      border-color: color-mix(in srgb, var(--eva-primary) 50%, transparent);
                    }
                  `}</style>
                  
                  {/* Badge */}
                  {cat.products_count !== undefined && (
                    <div className="absolute top-4 left-4 z-10 bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                      {cat.products_count} منتج
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4">
                    {cat.cover_image_url ? (
                      <Image
                        src={cat.cover_image_url}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-100">
                        🛍️
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg text-slate-800 text-center group-hover:text-[var(--eva-primary,#F97316)] transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};


