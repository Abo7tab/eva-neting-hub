'use client';

import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';

interface ColorPickerFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export function ColorPickerField({ label, value, onChange, disabled }: ColorPickerFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 overflow-hidden rounded-md border shadow-sm shrink-0">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="absolute -top-2 -left-2 w-14 h-14 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="uppercase font-mono w-28"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
