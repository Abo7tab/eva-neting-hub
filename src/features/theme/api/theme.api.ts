import { apiClient } from '@/shared/lib/api-client';
import type { AllThemesConfig, ThemeConfig, ThemeName, UpdateThemePayload } from '../types/theme.types';

export const fetchAllThemeSettings = async (): Promise<AllThemesConfig> => {
  const response = await apiClient.get<any[]>('/admin/settings');
  const settings = response.data; // Unwrapped by interceptor

  const extractTheme = (themeName: ThemeName): ThemeConfig => {
    const getVal = (key: string, def: string | number | null) => {
      const found = settings.find((s: any) => s.setting_key === `theme_${themeName}_${key}`);
      return found ? found.setting_value : def;
    };

    return {
      primary_color: getVal('primary_color', '#000000') as string,
      secondary_color: getVal('secondary_color', '#FFFFFF') as string,
      accent_color: getVal('accent_color', '#CCCCCC') as string,
      text_color: getVal('text_color', '#000000') as string,
      logo_url: getVal('logo_url', null) as string | null,
      bg_color_1: getVal('bg_color_1', '#000000') as string,
      bg_color_2: getVal('bg_color_2', '#FFFFFF') as string,
      animation_speed: Number(getVal('animation_speed', 50)),
      animation_blur: Number(getVal('animation_blur', 80)),
      animation_opacity: Number(getVal('animation_opacity', 60)),
      animation_blobs_count: Number(getVal('animation_blobs_count', 4)),
    };
  };

  return {
    default: extractTheme('default'),
    women: extractTheme('women'),
    men: extractTheme('men'),
  };
};

export const updateThemeSettings = async (themeName: ThemeName, config: ThemeConfig): Promise<void> => {
  const payload: UpdateThemePayload = {
    settings: [
      { setting_key: `theme_${themeName}_primary_color`, setting_value: config.primary_color },
      { setting_key: `theme_${themeName}_secondary_color`, setting_value: config.secondary_color },
      { setting_key: `theme_${themeName}_accent_color`, setting_value: config.accent_color },
      { setting_key: `theme_${themeName}_text_color`, setting_value: config.text_color },
      { setting_key: `theme_${themeName}_logo_url`, setting_value: config.logo_url },
      { setting_key: `theme_${themeName}_bg_color_1`, setting_value: config.bg_color_1 },
      { setting_key: `theme_${themeName}_bg_color_2`, setting_value: config.bg_color_2 },
      { setting_key: `theme_${themeName}_animation_speed`, setting_value: config.animation_speed.toString() },
      { setting_key: `theme_${themeName}_animation_blur`, setting_value: config.animation_blur.toString() },
      { setting_key: `theme_${themeName}_animation_opacity`, setting_value: config.animation_opacity.toString() },
      { setting_key: `theme_${themeName}_animation_blobs_count`, setting_value: config.animation_blobs_count.toString() },
    ]
  };

  await apiClient.put('/admin/settings/batch', payload);
};

export const uploadLogo = async (file: File): Promise<{ url: string; public_id: string }> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', 'themes');

  const response = await apiClient.post<{ url: string; public_id: string }>('/admin/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
