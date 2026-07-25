"use client";

import { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { Category } from '../types/category.types';

interface ParentSelectorProps {
  categories: Category[];
  currentCategoryUuid?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface FlattenedOption {
  uuid: string;
  name: string;
  level: number;
  disabled: boolean;
}

export function ParentSelector({
  categories,
  currentCategoryUuid,
  value,
  onChange,
  disabled = false,
}: ParentSelectorProps) {
  const options = useMemo(() => {
    const flattened: FlattenedOption[] = [];

    // Identify all descendants of current category to disable them
    const getDescendants = (uuid: string, all: Category[], descendants = new Set<string>()) => {
      const children = all.filter(c => c.parent_uuid === uuid);
      children.forEach(child => {
        descendants.add(child.uuid);
        getDescendants(child.uuid, all, descendants);
      });
      return descendants;
    };

    let invalidUuids = new Set<string>();
    if (currentCategoryUuid) {
      invalidUuids.add(currentCategoryUuid); // Can't be parent to itself
      invalidUuids = getDescendants(currentCategoryUuid, categories, invalidUuids);
    }

    // Recursively flatten tree with levels
    const buildOptions = (parentId: string | null, level: number) => {
      const children = categories
        .filter(c => c.parent_uuid === parentId)
        .sort((a, b) => a.sort_order - b.sort_order);

      children.forEach(child => {
        // We do not even render descendants of the current category
        // But for UI clarity, maybe we render them as disabled. 
        // Actually, it's safer to completely exclude the current and descendants.
        if (invalidUuids.has(child.uuid)) return;

        // If level is 3, we MUST disable it (limit is 3, making it a parent creates L4)
        const isMaxLevel = level >= 3;

        flattened.push({
          uuid: child.uuid,
          name: child.name,
          level,
          disabled: isMaxLevel,
        });

        buildOptions(child.uuid, level + 1);
      });
    };

    buildOptions(null, 1);
    return flattened;
  }, [categories, currentCategoryUuid]);

  // Use '' instead of 'none' if that's what we want for null
  const displayValue = value || 'none';

  return (
    <Select
      value={displayValue}
      onValueChange={(val) => {
        const v = val as string | null;
        onChange(v === 'none' || !v ? '' : v);
      }}
      disabled={disabled}
    >
      <SelectTrigger className="w-full h-10 px-3 flex justify-between items-center text-sm border border-input rounded-md bg-transparent">
        <SelectValue placeholder="اختر القسم الأب (أو اتركه قسماً رئيسياً)">
          {displayValue === 'none' 
            ? 'لا يوجد أب (قسم رئيسي)' 
            : options.find(o => o.uuid === displayValue)?.name || 'اختر القسم الأب (أو اتركه قسماً رئيسياً)'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none" className="font-semibold text-rose-600">
          لا يوجد أب (قسم رئيسي)
        </SelectItem>
        {options.map((option) => (
          <SelectItem 
            key={option.uuid} 
            value={option.uuid}
            disabled={option.disabled}
          >
            <span className="text-slate-400 select-none mr-1 inline-block" style={{ marginLeft: `${(option.level - 1) * 12}px` }}>
              {option.level > 1 && '—'.repeat(option.level - 1)}
            </span>
            <span>{option.name}</span>
            {option.disabled && <span className="text-xs text-slate-400 ml-2">(الحد الأقصى)</span>}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
