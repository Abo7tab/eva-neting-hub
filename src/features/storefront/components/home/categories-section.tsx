'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Category } from '@/features/categories/types/category.types';
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
        <p className="text-slate-500 mt-4 text-center max-w-md">
          اضغط على القسم لتشاهد جميع المنتجات الخاصة به
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-14 w-32 bg-slate-100 animate-pulse rounded-full" />
          ))}
        </div>
      ) : (
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="flex flex-wrap justify-center gap-3 md:gap-4"
          >
            {categories.map((cat, index) => (
              <motion.div
                key={cat.uuid}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  show: { opacity: 1, scale: 1, transition: { duration: 0.4, type: 'spring', bounce: 0.4 } }
                }}
              >
                <Link href={`/category/${cat.slug}`} className="block">
                  <div className="bg-white hover:bg-primary border border-slate-200 hover:border-primary shadow-sm hover:shadow-md transition-all duration-300 rounded-full px-6 md:px-8 py-3 flex items-center justify-center gap-3 group">
                    {cat.cover_image_url && (
                      <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0 shadow-sm border border-slate-100">
                        <Image 
                          src={cat.cover_image_url} 
                          alt={cat.name} 
                          fill 
                          className="object-cover" 
                          sizes="32px"
                        />
                      </div>
                    )}
                    <span className="font-bold text-slate-700 group-hover:text-primary-foreground transition-colors text-base md:text-lg">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
      )}
    </section>
  );
};


