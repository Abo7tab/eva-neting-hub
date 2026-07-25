"use client";

import Image from 'next/image';
import { MoreVertical, Edit, Trash2, Eye, Package } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { Badge } from '@/shared/components/ui/badge';
import { TableCell, TableRow } from '@/shared/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { useToggleProductField } from '../hooks/use-products';
import type { Product } from '../types/product.types';

interface ProductRowProps {
  product: Product;
  onEdit: (uuid: string) => void;
  onDelete: (product: Product) => void;
}

export function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
  const toggleField = useToggleProductField();

  const handleToggle = (field: 'is_trending' | 'is_featured' | 'active_status') => {
    toggleField.mutate({
      uuid: product.uuid,
      field,
      value: !product[field],
    });
  };

  return (
    <TableRow className="hover:bg-slate-50">
      {/* Image + Name + SKU */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
            {product.cover_image_url ? (
              <Image
                src={product.cover_image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <Package className="h-5 w-5 text-slate-400" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">
              {product.name}
            </p>
            {product.sku && (
              <p className="text-xs text-slate-500 mt-0.5">SKU: {product.sku}</p>
            )}
          </div>
        </div>
      </TableCell>

      {/* Brand */}
      <TableCell>
        <span className="text-sm text-slate-700">
          {product.brand?.name || '-'}
        </span>
      </TableCell>

      {/* Category */}
      <TableCell>
        <span className="text-sm text-slate-700">
          {product.category?.name || '-'}
        </span>
      </TableCell>

      {/* Price */}
      <TableCell>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            <span dir="ltr" className="inline-block">
              {Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span> ج.م
          </p>
          {product.compare_at_price && (
            <p className="text-xs text-slate-400 line-through">
              <span dir="ltr" className="inline-block">
                {Number(product.compare_at_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span> ج.م
            </p>
          )}
        </div>
      </TableCell>

      {/* Stock */}
      <TableCell>
        <Badge variant={product.stock_quantity > 0 ? 'default' : 'destructive'}>
          {product.stock_quantity}
        </Badge>
      </TableCell>

      {/* Trending Toggle */}
      <TableCell>
        <Tooltip>
          <TooltipTrigger>
            <div>
              <Switch
                checked={product.is_trending}
                onCheckedChange={() => handleToggle('is_trending')}
                disabled={toggleField.isPending}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{product.is_trending ? 'إلغاء "رائج"' : 'تعيين كـ "رائج"'}</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>

      {/* Featured Toggle */}
      <TableCell>
        <Tooltip>
          <TooltipTrigger>
            <div>
              <Switch
                checked={product.is_featured}
                onCheckedChange={() => handleToggle('is_featured')}
                disabled={toggleField.isPending}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{product.is_featured ? 'إلغاء "مميز"' : 'تعيين كـ "مميز"'}</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>

      {/* Active Toggle */}
      <TableCell>
        <Tooltip>
          <TooltipTrigger>
            <div>
              <Switch
                checked={product.active_status}
                onCheckedChange={() => handleToggle('active_status')}
                disabled={toggleField.isPending}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{product.active_status ? 'تعطيل المنتج' : 'تفعيل المنتج'}</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>

      {/* Views */}
      <TableCell>
        <div className="flex items-center gap-1 text-sm text-slate-500">
          <Eye className="h-3 w-3" />
          {product.views_count}
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 h-8 w-8 focus:outline-none">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onEdit(product.uuid)}>
              <Edit className="ml-2 h-4 w-4" />
              تعديل
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(product)}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="ml-2 h-4 w-4" />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
