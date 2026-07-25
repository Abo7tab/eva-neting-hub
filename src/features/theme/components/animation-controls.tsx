'use client';

import { Label } from '@/shared/components/ui/label';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

function CustomSlider({ label, value, min, max, onChange, disabled }: SliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-sm text-muted-foreground w-8 text-left">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed accent-primary"
      />
    </div>
  );
}

interface AnimationControlsProps {
  speed: number;
  onSpeedChange: (val: number) => void;
  blur: number;
  onBlurChange: (val: number) => void;
  opacity: number;
  onOpacityChange: (val: number) => void;
  blobsCount: number;
  onBlobsCountChange: (val: number) => void;
  disabled?: boolean;
}

export function AnimationControls({
  speed, onSpeedChange,
  blur, onBlurChange,
  opacity, onOpacityChange,
  blobsCount, onBlobsCountChange,
  disabled
}: AnimationControlsProps) {
  return (
    <div className="space-y-6">
      <CustomSlider
        label="سرعة الحركة (0-100)"
        value={speed}
        min={0}
        max={100}
        onChange={onSpeedChange}
        disabled={disabled}
      />
      <CustomSlider
        label="كثافة الضبابية (0-100)"
        value={blur}
        min={0}
        max={100}
        onChange={onBlurChange}
        disabled={disabled}
      />
      <CustomSlider
        label="الشفافية (0-100)"
        value={opacity}
        min={0}
        max={100}
        onChange={onOpacityChange}
        disabled={disabled}
      />
      <CustomSlider
        label="عدد العناصر (2-8)"
        value={blobsCount}
        min={2}
        max={8}
        onChange={onBlobsCountChange}
        disabled={disabled}
      />
    </div>
  );
}
