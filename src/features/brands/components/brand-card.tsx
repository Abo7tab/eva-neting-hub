"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Edit, Trash2, Package, EyeOff, GripVertical } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { ConfirmDeleteDialog } from '@/shared/components/feedback/confirm-delete-dialog';
import { useUpdateBrand, useDeleteBrand } from '../hooks/use-brands';
import type { Brand } from '../types/brand.types';
import { cn } from '@/shared/lib/utils';

interface BrandCardProps {
  brand: Brand;
}

export function BrandCard({ brand }: BrandCardProps) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const updateMutation = useUpdateBrand(brand.uuid);
  const deleteMutation = useDeleteBrand();

  const toggleActive = () => {
    updateMutation.mutate({ active_status: !brand.active_status });
  };

  return (
    <>
      <Card className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-md",
        !brand.active_status && "opacity-75 grayscale-[0.2]"
      )}>
        {/* Active Status Ribbon / Badge */}
        {!brand.active_status && (
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="secondary" className="bg-slate-200 text-slate-600 flex items-center gap-1">
              <EyeOff className="h-3 w-3" />
              مخفي
            </Badge>
          </div>
        )}

        <div className="p-5 flex flex-col h-full gap-4">
          {/* Header area with Logo and Dropdown */}
          <div className="flex items-start justify-between">
            <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-2 relative overflow-hidden shrink-0">
              {brand.logo_url ? (
                <Image
                  src={brand.logo_url}
                  alt={brand.name}
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                />
              ) : (
                <div className="text-xl font-bold text-slate-300">
                  {brand.name.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-slate-400 group-hover:text-slate-700")}>
                <GripVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/admin/brands/${brand.uuid}/edit`)}>
                  <Edit className="ml-2 h-4 w-4" />
                  تعديل البراند
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleActive}>
                  {brand.active_status ? (
                    <>
                      <EyeOff className="ml-2 h-4 w-4 text-slate-500" />
                      إخفاء البراند
                    </>
                  ) : (
                    <>
                      <Package className="ml-2 h-4 w-4 text-green-600" />
                      تفعيل البراند
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowDelete(true)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                  <Trash2 className="ml-2 h-4 w-4" />
                  حذف البراند
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Info Area */}
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 truncate" title={brand.name}>
              {brand.name}
            </h3>
            {brand.description ? (
              <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                {brand.description}
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic mt-1">لا يوجد وصف</p>
            )}
          </div>

          {/* Footer Area */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-slate-400" />
              <span>{brand.products_count ?? 0} منتج</span>
            </div>
            
            <div className="font-mono text-[10px] text-slate-400">
              ترتيب: {brand.sort_order}
            </div>
          </div>
        </div>
      </Card>

      <ConfirmDeleteDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="حذف البراند"
        description={`هل أنت متأكد من حذف براند "${brand.name}"؟`}
        onConfirm={() => deleteMutation.mutate(brand.uuid)}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}
