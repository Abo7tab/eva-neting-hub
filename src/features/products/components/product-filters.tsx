"use client";

import { X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

interface ProductFiltersProps {
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
  sortBy,
  onSortChange,
  brandUuid,
  onBrandChange,
  categoryUuid,
  onCategoryChange,
  status,
  onStatusChange,
  brands,
  categories: rawCategories,
  onResetFilters,
  hasActiveFilters,
}: ProductFiltersProps) {
  const STATUS_LABELS: Record<string, string> = {
    'all': 'كل الحالات',
    'active': 'نشط',
    'inactive': 'غير نشط',
  };

  const SORT_LABELS: Record<string, string> = {
    'newest': 'الأحدث',
    'oldest': 'الأقدم',
    'price_asc': 'السعر: من الأقل',
    'price_desc': 'السعر: من الأعلى',
    'popular': 'الأكثر مشاهدة',
  };

  const getHierarchicalCategories = (cats: any[]) => {
    const map = new Map<string, any[]>();
    const roots: any[] = [];
    cats.forEach(c => {
      if (c.parent_uuid) {
        if (!map.has(c.parent_uuid)) map.set(c.parent_uuid, []);
        map.get(c.parent_uuid)!.push(c);
      } else {
        roots.push(c);
      }
    });

    const result: any[] = [];
    const traverse = (node: any, level: number) => {
      result.push({ ...node, level });
      const children = map.get(node.uuid) || [];
      children.forEach(child => traverse(child, level + 1));
    };
    roots.forEach(root => traverse(root, 0));
    return result;
  };

  const categories = getHierarchicalCategories(rawCategories);
  const selectedBrand = brands.find((b) => b.uuid === brandUuid);
  const selectedCategory = categories.find((c) => c.uuid === categoryUuid);

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Select value={brandUuid || 'all'} onValueChange={(v) => onBrandChange(v === 'all' ? '' : (v || ''))}>
          <SelectTrigger>
            <SelectValue placeholder="كل البراندات">
              {brandUuid && brandUuid !== 'all' ? selectedBrand?.name || 'كل البراندات' : 'كل البراندات'}
            </SelectValue>
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
            <SelectValue placeholder="كل الأقسام">
              {categoryUuid && categoryUuid !== 'all' ? selectedCategory?.name || 'كل الأقسام' : 'كل الأقسام'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الأقسام</SelectItem>
            {categories.map((c: any) => (
              <SelectItem key={c.uuid} value={c.uuid}>
                {'\u00A0\u00A0\u00A0\u00A0'.repeat(c.level || 0)}{c.level > 0 ? '— ' : ''}{c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status || 'all'} onValueChange={(v) => onStatusChange(v === 'all' ? '' : (v || ''))}>
          <SelectTrigger>
            <SelectValue>
              {STATUS_LABELS[status || 'all'] || 'كل الحالات'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy || 'newest'} onValueChange={(v) => onSortChange(v || 'newest')}>
          <SelectTrigger>
            <SelectValue>
              {SORT_LABELS[sortBy || 'newest'] || 'الأحدث'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
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
