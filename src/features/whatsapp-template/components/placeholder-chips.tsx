'use client';

import { Button } from '@/shared/components/ui/button';

interface Placeholder {
  label: string;
  value: string;
}

const PLACEHOLDERS: Placeholder[] = [
  { label: 'المنتجات', value: '{items}' },
  { label: 'المجموع الفرعي', value: '{subtotal}' },
  { label: 'الإجمالي', value: '{total_price}' },
  { label: 'عدد المنتجات', value: '{total_items}' },
  { label: 'رقم الطلب', value: '{reference_code}' },
];

interface PlaceholderChipsProps {
  onInsert: (placeholder: string) => void;
  disabled?: boolean;
}

export function PlaceholderChips({ onInsert, disabled }: PlaceholderChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {PLACEHOLDERS.map((ph) => (
        <Button
          key={ph.value}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onInsert(ph.value)}
          disabled={disabled}
          className="flex flex-col items-center h-auto py-1.5 px-3"
        >
          <span className="text-sm font-medium">{ph.label}</span>
          <span className="text-[10px] text-muted-foreground font-mono mt-0.5">{ph.value}</span>
        </Button>
      ))}
    </div>
  );
}
