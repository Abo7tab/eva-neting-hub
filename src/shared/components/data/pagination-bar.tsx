"use client";

import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  itemName?: string; // e.g., 'منتج', 'براند', 'قسم'
}

export function PaginationBar({
  currentPage,
  totalPages,
  total,
  perPage,
  onPageChange,
  itemName = 'عنصر',
}: PaginationBarProps) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, total);

  return (
    <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 p-4">
      <div className="text-sm text-slate-600">
        عرض {start} - {end} من {total} {itemName}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronRight className="h-4 w-4 ml-1" />
          السابق
        </Button>

        <span className="text-sm text-slate-600 px-4">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          التالي
          <ChevronLeft className="h-4 w-4 mr-1" />
        </Button>
      </div>
    </div>
  );
}
