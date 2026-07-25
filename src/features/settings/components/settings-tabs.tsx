'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Button } from '@/shared/components/ui/button';
import { Save, Loader2, RefreshCcw } from 'lucide-react';
import { useSettings } from '../hooks/use-settings';
import { SiteSetting } from '../types/settings.types';
import { SettingsSection } from './settings-section';
import { SettingField } from './setting-field';

export function SettingsTabs() {
  const { settings, isLoading, isError, batchUpdate, isUpdating } = useSettings();
  const [localSettings, setLocalSettings] = useState<Record<string, string | null>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Initialize local state when data is loaded
  useEffect(() => {
    if (settings) {
      const initialMap: Record<string, string | null> = {};
      settings.forEach((s) => {
        initialMap[s.setting_key] = s.setting_value;
      });
      setLocalSettings(initialMap);
      setIsDirty(false);
    }
  }, [settings]);

  const handleChange = (key: string, val: string | null) => {
    setLocalSettings((prev) => {
      const updated = { ...prev, [key]: val };
      setIsDirty(true);
      return updated;
    });
  };

  const handleSave = () => {
    if (!settings) return;

    // Find only changed settings
    const changedSettings = settings
      .filter((s) => localSettings[s.setting_key] !== s.setting_value)
      .map((s) => ({
        setting_key: s.setting_key,
        setting_value: localSettings[s.setting_key],
      }));

    if (changedSettings.length === 0) {
      return;
    }

    batchUpdate(
      { settings: changedSettings },
      {
        onSuccess: () => {
          setIsDirty(false);
        },
      }
    );
  };

  const handleReset = () => {
    if (settings) {
      const initialMap: Record<string, string | null> = {};
      settings.forEach((s) => {
        initialMap[s.setting_key] = s.setting_value;
      });
      setLocalSettings(initialMap);
      setIsDirty(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !settings) {
    return (
      <div className="bg-destructive/15 text-destructive p-4 rounded-md text-sm border border-destructive/20 font-medium">
        فشل في تحميل الإعدادات.
      </div>
    );
  }

  // Helper to render a group of settings
  const renderGroup = (keys: string[]) => {
    return keys.map((key) => {
      const setting = settings.find((s) => s.setting_key === key);
      if (!setting) return null;
      return (
        <SettingField
          key={key}
          setting={setting}
          value={localSettings[key]}
          onChange={handleChange}
        />
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-4 rounded-lg border">
        <div>
          <h2 className="text-lg font-bold">إدارة المحتوى والإعدادات</h2>
          <p className="text-sm text-muted-foreground">
            تعديل النصوص، الصور، والروابط في الموقع
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isDirty && (
            <Button variant="ghost" size="sm" onClick={handleReset} disabled={isUpdating}>
              <RefreshCcw className="h-4 w-4 ml-2" />
              تراجع
            </Button>
          )}
          <Button onClick={handleSave} disabled={!isDirty || isUpdating} className="w-full sm:w-auto">
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
            ) : (
              <Save className="h-4 w-4 ml-2" />
            )}
            حفظ التغييرات
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full" dir="rtl">
        <TabsList className="w-full flex-wrap h-auto justify-start mb-6">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="contact">التواصل</TabsTrigger>
          <TabsTrigger value="seo">SEO (محركات البحث)</TabsTrigger>
          <TabsTrigger value="aeo">AEO (الذكاء الاصطناعي)</TabsTrigger>
          <TabsTrigger value="content">محتوى الصفحات (CMS)</TabsTrigger>
          <TabsTrigger value="analytics">التتبع</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <SettingsSection title="معلومات الموقع">
            <div className="grid gap-6 md:grid-cols-2">
              {renderGroup(['site_name', 'site_tagline_ar', 'copyright_text_ar', 'business_hours_ar'])}
            </div>
          </SettingsSection>
          <SettingsSection title="الصور">
            <div className="grid gap-6 md:grid-cols-2">
              {renderGroup(['site_logo_url', 'site_favicon_url'])}
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <SettingsSection title="بيانات التواصل">
            <div className="grid gap-6 md:grid-cols-2">
              {renderGroup([
                'contact_email',
                'contact_phone',
                'contact_phone_display',
                'contact_address_ar',
              ])}
            </div>
          </SettingsSection>
          <SettingsSection title="منصات التواصل الاجتماعي">
            <div className="grid gap-6 md:grid-cols-2">
              {renderGroup([
                'social_facebook',
                'social_instagram',
                'social_tiktok',
                'social_youtube',
                'social_whatsapp_main',
              ])}
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <SettingsSection title="تحسين محركات البحث">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                {renderGroup(['seo_meta_title'])}
              </div>
              <div className="md:col-span-2">
                {renderGroup(['seo_meta_description'])}
              </div>
              <div className="md:col-span-2">
                {renderGroup(['seo_meta_keywords'])}
              </div>
              {renderGroup(['seo_business_name', 'seo_business_type'])}
              <div className="md:col-span-2">
                {renderGroup(['seo_business_description_ar'])}
              </div>
              <div className="md:col-span-2">
                {renderGroup(['seo_og_image_url'])}
              </div>
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="aeo" className="space-y-6">
          <SettingsSection title="تحسين محركات الذكاء الاصطناعي (AEO)">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                {renderGroup([
                  'aeo_business_summary_ar',
                  'aeo_key_features_ar',
                  'aeo_target_audience_ar',
                  'aeo_faqs_json',
                ])}
              </div>
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <SettingsSection title="صفحة الترحيب (Landing Page)">
            <div className="grid gap-6 md:grid-cols-2">
              {renderGroup([
                'content_landing_title_ar',
                'content_landing_subtitle_ar',
                'content_landing_women_button_ar',
                'content_landing_men_button_ar',
                'content_landing_skip_ar',
              ])}
            </div>
          </SettingsSection>
          <SettingsSection title="الواجهة الرئيسية (Default Theme)">
            <div className="grid gap-6 md:grid-cols-2">
              {renderGroup([
                'content_home_hero_title_default_ar',
                'content_home_hero_cta_default_ar',
              ])}
              <div className="md:col-span-2">
                {renderGroup(['content_home_hero_subtitle_default_ar'])}
              </div>
            </div>
          </SettingsSection>
          <SettingsSection title="واجهة حريمي (Women Theme)">
            <div className="grid gap-6 md:grid-cols-2">
              {renderGroup([
                'content_home_hero_title_women_ar',
                'content_home_hero_cta_women_ar',
              ])}
              <div className="md:col-span-2">
                {renderGroup(['content_home_hero_subtitle_women_ar'])}
              </div>
            </div>
          </SettingsSection>
          <SettingsSection title="واجهة رجالي (Men Theme)">
            <div className="grid gap-6 md:grid-cols-2">
              {renderGroup([
                'content_home_hero_title_men_ar',
                'content_home_hero_cta_men_ar',
              ])}
              <div className="md:col-span-2">
                {renderGroup(['content_home_hero_subtitle_men_ar'])}
              </div>
            </div>
          </SettingsSection>
          <SettingsSection title="عناوين الأقسام الرئيسية">
            <div className="grid gap-6 md:grid-cols-2">
              {renderGroup([
                'content_featured_section_title_ar',
                'content_trending_section_title_ar',
                'content_categories_section_title_ar',
                'content_brands_section_title_ar',
              ])}
            </div>
          </SettingsSection>
          <SettingsSection title="النصوص العامة للأزرار">
            <div className="grid gap-6 md:grid-cols-2">
              {renderGroup([
                'content_add_to_cart_button_ar',
                'content_view_product_button_ar',
                'content_order_now_button_ar',
                'content_continue_shopping_button_ar',
              ])}
            </div>
          </SettingsSection>
          <SettingsSection title="رسائل الحالة">
            <div className="grid gap-6 md:grid-cols-2">
              {renderGroup([
                'content_empty_cart_ar',
                'content_no_products_ar',
                'content_search_no_results_ar',
              ])}
            </div>
          </SettingsSection>
          <SettingsSection title="تذييل الموقع (Footer)">
            <div className="grid gap-6">
              {renderGroup(['content_footer_about_ar'])}
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <SettingsSection title="أكواد التتبع والإحصائيات">
            <div className="grid gap-6 md:grid-cols-2">
              {renderGroup([
                'analytics_google_id',
                'analytics_facebook_pixel_id',
                'analytics_tiktok_pixel_id',
              ])}
            </div>
          </SettingsSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}
