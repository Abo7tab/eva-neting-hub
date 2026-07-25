'use client';

import { SearchInput } from '@/shared/components/data/search-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { OrdersListParams } from '../types/order.types';

interface OrdersFiltersProps {
  filters: OrdersListParams;
  onFilterChange: (key: keyof OrdersListParams, value: any) => void;
}

const STATUS_LABELS: Record<string, string> = {
  'all': 'كل الحالات',
  'pending': 'قيد الانتظار',
  'redirected': 'تم التحويل',
  'completed': 'مكتمل',
  'failed': 'فشل',
};

const SORT_LABELS: Record<string, string> = {
  'newest': 'الأحدث',
  'oldest': 'الأقدم',
  'highest_price': 'الأعلى قيمة',
  'lowest_price': 'الأقل قيمة',
};

export function OrdersFilters({ filters, onFilterChange }: OrdersFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 max-w-sm">
        <SearchInput
          value={filters.search ?? ''}
          onChange={(val) => onFilterChange('search', val)}
          placeholder="ابحث برقم الطلب، اسم العميل، الهاتف..."
        />
      </div>

      <div className="w-full sm:w-48">
        <Select
          value={filters.sort_by ?? 'newest'}
          onValueChange={(val) => onFilterChange('sort_by', val)}
        >
          <SelectTrigger>
            <SelectValue>{SORT_LABELS[filters.sort_by ?? 'newest']}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-48">
        <Select
          value={filters.status ?? 'all'}
          onValueChange={(val) => onFilterChange('status', val === 'all' ? undefined : val)}
        >
          <SelectTrigger>
            <SelectValue>{STATUS_LABELS[filters.status ?? 'all']}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
