export type ThemeName = 'default' | 'women' | 'men';

export interface ThemeConfig {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  logo_url: string | null;
  bg_color_1: string;
  bg_color_2: string;
  animation_speed: number;
  animation_blur: number;
  animation_opacity: number;
  animation_blobs_count: number;
}

export interface AllThemesConfig {
  default: ThemeConfig;
  women: ThemeConfig;
  men: ThemeConfig;
}

export interface UpdateThemePayload {
  settings: {
    setting_key: string;
    setting_value: string | null;
  }[];
}
