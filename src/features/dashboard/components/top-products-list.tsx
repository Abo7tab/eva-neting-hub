"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, ArrowLeft, Package } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import type { TopProduct } from '../types/dashboard.types';

interface TopProductsListProps {
  products: TopProduct[] | undefined;
  isLoading: boolean;
}

export function TopProductsList({ products, isLoading }: TopProductsListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.7 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">الأكثر مشاهدة</CardTitle>
            <CardDescription>المنتجات الرائجة</CardDescription>
          </div>
          <Link href="/admin/products">
            <Button variant="ghost" size="sm">
              عرض الكل
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-5">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-14 w-14 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              لا توجد منتجات
            </div>
          ) : (
            <div className="space-y-5">
              {products.map((product, index) => (
                <div
                  key={product.uuid}
                  className="flex items-center gap-3 hover:bg-slate-50 -mx-2 px-2 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                    {product.cover_image_url ? (
                      <Image
                        src={product.cover_image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {product.views_count}
                      </span>
                      <span className="text-xs font-semibold text-rose-600">
                        {Number(product.price).toLocaleString('ar-EG')} ج
                      </span>
                    </div>
                  </div>
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0',
                    index === 0 ? 'bg-rose-100 text-rose-600' :
                    index === 1 ? 'bg-orange-100 text-orange-600' :
                    index === 2 ? 'bg-amber-100 text-amber-600' :
                    'bg-slate-100 text-slate-500'
                  )}>
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
