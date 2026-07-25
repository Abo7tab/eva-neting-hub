export type ThemeName = 'default' | 'women' | 'men';

// What the backend API actually returns from GET /api/v1/public/theme/{name}
export interface ThemeApiResponse {
  theme: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  logo_url: string | null;
  background: {
    color_1: string;
    color_2: string;
    animation_speed: number;
    animation_blur: number;
    animation_opacity: number;
    animation_blobs_count: number;
  };
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
