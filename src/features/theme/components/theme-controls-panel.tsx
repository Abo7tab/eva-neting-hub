'use client';

import { Card } from '@/shared/components/ui/card';
import { ColorPickerField } from './color-picker-field';
import { LogoUploader } from './logo-uploader';
import { AnimationControls } from './animation-controls';
import type { ThemeConfig } from '../types/theme.types';

interface ThemeControlsPanelProps {
  config: ThemeConfig;
  onChange: (config: ThemeConfig) => void;
  disabled?: boolean;
}

export function ThemeControlsPanel({ config, onChange, disabled }: ThemeControlsPanelProps) {
  const handleChange = <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <Card className="p-6 space-y-8">
      
      {/* Section 1: Colors */}
      <section>
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">الألوان</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ColorPickerField 
            label="اللون الأساسي (Primary)"
            value={config.primary_color}
            onChange={(val) => handleChange('primary_color', val)}
            disabled={disabled}
          />
          <ColorPickerField 
            label="اللون الثانوي (Secondary)"
            value={config.secondary_color}
            onChange={(val) => handleChange('secondary_color', val)}
            disabled={disabled}
          />
          <ColorPickerField 
            label="لون التمييز (Accent)"
            value={config.accent_color}
            onChange={(val) => handleChange('accent_color', val)}
            disabled={disabled}
          />
          <ColorPickerField 
            label="لون النصوص (Text)"
            value={config.text_color}
            onChange={(val) => handleChange('text_color', val)}
            disabled={disabled}
          />
        </div>
      </section>

      {/* Section 2: Logo */}
      <section>
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">اللوجو</h3>
        <LogoUploader 
          label="صورة اللوجو"
          value={config.logo_url}
          onChange={(val) => handleChange('logo_url', val)}
          disabled={disabled}
        />
      </section>

      {/* Section 3: Animated Background Colors */}
      <section>
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">ألوان خلفية الأنيميشن</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
          <ColorPickerField 
            label="لون الخلفية 1"
            value={config.bg_color_1}
            onChange={(val) => handleChange('bg_color_1', val)}
            disabled={disabled}
          />
          <ColorPickerField 
            label="لون الخلفية 2"
            value={config.bg_color_2}
            onChange={(val) => handleChange('bg_color_2', val)}
            disabled={disabled}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">ملاحظة: ستمتزج هذه الألوان مع اللون الأبيض تلقائياً في الخلفية.</p>
      </section>

      {/* Section 4: Animation Settings */}
      <section>
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">إعدادات الحركة</h3>
        <AnimationControls
          speed={config.animation_speed}
          onSpeedChange={(val) => handleChange('animation_speed', val)}
          blur={config.animation_blur}
          onBlurChange={(val) => handleChange('animation_blur', val)}
          opacity={config.animation_opacity}
          onOpacityChange={(val) => handleChange('animation_opacity', val)}
          blobsCount={config.animation_blobs_count}
          onBlobsCountChange={(val) => handleChange('animation_blobs_count', val)}
          disabled={disabled}
        />
      </section>
      
    </Card>
  );
}
