'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Button } from '@/shared/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { ThemeControlsPanel } from './theme-controls-panel';
import { ThemePreviewCard } from './theme-preview-card';
import { AnimatedBackgroundPreview } from './animated-background-preview';
import { useUpdateTheme } from '../hooks/use-theme';
import type { AllThemesConfig, ThemeName, ThemeConfig } from '../types/theme.types';

interface ThemeTabsProps {
  initialConfigs: AllThemesConfig;
}

export function ThemeTabs({ initialConfigs }: ThemeTabsProps) {
  const [activeTab, setActiveTab] = useState<ThemeName>('default');
  const [configs, setConfigs] = useState<AllThemesConfig>(initialConfigs);
  
  const updateMutation = useUpdateTheme();

  // Reset local state if initial data changes (e.g. after save refetch)
  useEffect(() => {
    setConfigs(initialConfigs);
  }, [initialConfigs]);

  const handleConfigChange = (theme: ThemeName, newConfig: ThemeConfig) => {
    setConfigs(prev => ({
      ...prev,
      [theme]: newConfig
    }));
  };

  const handleSave = () => {
    updateMutation.mutate({
      themeName: activeTab,
      config: configs[activeTab]
    });
  };

  const isDirty = (theme: ThemeName) => {
    return JSON.stringify(configs[theme]) !== JSON.stringify(initialConfigs[theme]);
  };

  const currentConfig = configs[activeTab];

  // Prevent accidental navigation if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty('default') || isDirty('women') || isDirty('men')) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [configs, initialConfigs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as ThemeName)} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger 
              value="default" 
              className={activeTab === 'default' ? 'text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none' : ''}
              style={activeTab === 'default' ? { color: currentConfig.primary_color, borderColor: currentConfig.primary_color } : {}}
            >
              الافتراضي
              {isDirty('default') && <span className="ml-2 w-2 h-2 rounded-full bg-orange-500" title="يوجد تغييرات غير محفوظة" />}
            </TabsTrigger>
            <TabsTrigger 
              value="women"
              className={activeTab === 'women' ? 'text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none' : ''}
              style={activeTab === 'women' ? { color: currentConfig.primary_color, borderColor: currentConfig.primary_color } : {}}
            >
              حريمي
              {isDirty('women') && <span className="ml-2 w-2 h-2 rounded-full bg-orange-500" title="يوجد تغييرات غير محفوظة" />}
            </TabsTrigger>
            <TabsTrigger 
              value="men"
              className={activeTab === 'men' ? 'text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none' : ''}
              style={activeTab === 'men' ? { color: currentConfig.primary_color, borderColor: currentConfig.primary_color } : {}}
            >
              رجالي
              {isDirty('men') && <span className="ml-2 w-2 h-2 rounded-full bg-orange-500" title="يوجد تغييرات غير محفوظة" />}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button 
          onClick={handleSave} 
          disabled={!isDirty(activeTab) || updateMutation.isPending}
          className="fixed bottom-4 left-4 z-50 shadow-lg sm:static sm:shadow-none sm:z-auto"
        >
          {updateMutation.isPending ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="ml-2 h-4 w-4" />
          )}
          حفظ التعديلات ({activeTab === 'default' ? 'الافتراضي' : activeTab === 'women' ? 'حريمي' : 'رجالي'})
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Controls */}
        <ThemeControlsPanel 
          config={currentConfig}
          onChange={(newConfig) => handleConfigChange(activeTab, newConfig)}
          disabled={updateMutation.isPending}
        />

        {/* Right Column: Live Previews */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <div className="h-64 sm:h-80 w-full shadow-sm rounded-lg overflow-hidden border">
            <AnimatedBackgroundPreview 
              color1={currentConfig.bg_color_1}
              color2={currentConfig.bg_color_2}
              speed={currentConfig.animation_speed}
              blur={currentConfig.animation_blur}
              opacity={currentConfig.animation_opacity}
              blobsCount={currentConfig.animation_blobs_count}
            />
          </div>
          
          <div className="shadow-sm rounded-lg overflow-hidden h-[400px]">
            <ThemePreviewCard config={currentConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}
