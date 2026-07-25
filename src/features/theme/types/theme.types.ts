export type ThemeName = 'default' | 'women' | 'men';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

export interface ThemeBackground {
  color_1: string;
  color_2: string;
  animation_speed: number;
  animation_blur: number;
  animation_opacity: number;
  animation_blobs_count: number;
}

export interface ThemeApiResponse {
  theme: 'default' | 'women' | 'men';
  colors: ThemeColors;
  logo_url: string | null;
  background: ThemeBackground;
}

// Legacy flat config used in admin theme settings
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
