import { ListPageHeader } from '@/shared/components/data/list-page-header';
import { SettingsTabs } from '@/features/settings/components/settings-tabs';

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6" dir="rtl">
      <ListPageHeader 
        title="الإعدادات العامة" 
        description="إدارة نصوص وصور وألوان الموقع وإعدادات SEO"
      />
      <SettingsTabs />
    </div>
  );
}
