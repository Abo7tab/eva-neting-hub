'use client';

import { ListPageHeader } from '@/shared/components/data/list-page-header';
import { ThemeTabs } from '@/features/theme/components/theme-tabs';
import { useThemeSettings } from '@/features/theme/hooks/use-theme';

export default function ThemeSettingsPage() {
  const { data: initialConfigs, isLoading, isError } = useThemeSettings();

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <ListPageHeader
          title="إعدادات الثيم"
          description="خصص الألوان، اللوجو، وخلفية الأنيميشن لكل قسم"
        />
        <div className="h-10 bg-muted animate-pulse rounded w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[600px] bg-muted animate-pulse rounded-lg" />
          <div className="space-y-6">
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
            <div className="h-[400px] bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !initialConfigs) {
    return (
      <div className="p-8 text-center text-red-500">
        حدث خطأ أثناء تحميل إعدادات الثيم. يرجى تحديث الصفحة.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <ListPageHeader
        title="إعدادات الثيم"
        description="خصص الألوان، اللوجو، وخلفية الأنيميشن لكل قسم"
      />
      
      <ThemeTabs initialConfigs={initialConfigs} />
    </div>
  );
}
