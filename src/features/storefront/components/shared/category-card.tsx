'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/features/categories/types/category.types';

interface CategoryCardProps {
  category: Category;
  index: number;
}

export const CategoryCard = ({ category, index }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link href={`/category/${category.slug}`} className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 bg-slate-50 border-4 border-white group-hover:border-primary">
          <Image
            src={category.cover_image_url || '/placeholder.png'}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 128px, 160px"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-primary/10 transition-colors duration-300" />
        </div>
        
        <h3 className="font-bold text-slate-800 text-center transition-colors group-hover:text-primary">
          {category.name}
        </h3>
      </Link>
    </motion.div>
  );
};

export const CategoryCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-100 animate-pulse border-4 border-white shadow-sm" />
      <div className="h-5 bg-slate-100 rounded animate-pulse w-24" />
    </div>
  );
};
