"use client";

import { Search, X } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  brandUuid?: string;
  onBrandChange: (value: string) => void;
  categoryUuid?: string;
  onCategoryChange: (value: string) => void;
  status?: string;
  onStatusChange: (value: string) => void;
  brands: Array<{ uuid: string; name: string }>;
  categories: Array<{ uuid: string; name: string }>;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export function ProductFilters({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  brandUuid,
  onBrandChange,
  categoryUuid,
  onCategoryChange,
  status,
  onStatusChange,
  brands,
  categories,
  onResetFilters,
  hasActiveFilters,
}: ProductFiltersProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="ابحث بالاسم أو SKU..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Filters row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Select value={brandUuid || 'all'} onValueChange={(v) => onBrandChange(v === 'all' ? '' : (v || ''))}>
          <SelectTrigger>
            <SelectValue placeholder="كل البراندات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل البراندات</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b.uuid} value={b.uuid}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={categoryUuid || 'all'} onValueChange={(v) => onCategoryChange(v === 'all' ? '' : (v || ''))}>
          <SelectTrigger>
            <SelectValue placeholder="كل الأقسام" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الأقسام</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.uuid} value={c.uuid}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status || 'all'} onValueChange={(v) => onStatusChange(v === 'all' ? '' : (v || ''))}>
          <SelectTrigger>
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="inactive">غير نشط</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => onSortChange(v || 'newest')}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">الأحدث أولاً</SelectItem>
            <SelectItem value="oldest">الأقدم أولاً</SelectItem>
            <SelectItem value="price_asc">السعر: من الأقل</SelectItem>
            <SelectItem value="price_desc">السعر: من الأعلى</SelectItem>
            <SelectItem value="popular">الأكثر مشاهدة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset filters */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onResetFilters}
            className="text-slate-500 hover:text-slate-900"
          >
            <X className="h-4 w-4 ml-1" />
            مسح الفلاتر
          </Button>
        </div>
      )}
    </div>
  );
}
