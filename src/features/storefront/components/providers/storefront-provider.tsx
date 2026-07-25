'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { usePublicSettings, usePublicTheme, usePublicCategories } from '../../hooks/use-storefront';
import { ThemeApiResponse } from '@/features/theme/types/theme.types';
import NextTopLoader from 'nextjs-toploader';

interface StorefrontContextValue {
  settings: Record<string, string | null>;
  themeConfig: ThemeApiResponse | null;
  activeTheme: 'default' | 'women' | 'men';
  setActiveTheme: (theme: 'default' | 'women' | 'men') => void;
  isLoading: boolean;
}

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export const useStorefrontContext = () => {
  const ctx = useContext(StorefrontContext);
  if (!ctx) throw new Error('useStorefrontContext must be used within StorefrontProvider');
  return ctx;
};

// Determine white or dark text based on background color luminance
const getContrastColor = (hex: string): string => {
  if (!hex || !hex.startsWith('#')) return '#FFFFFF';
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 140 ? '#FFFFFF' : '#0F172A';
};

// Detect gender theme from category tree
const detectThemeFromCategory = (
  slug: string,
  categories: Array<{ uuid: string; name: string; slug: string; parent_uuid?: string | null }>
): 'default' | 'women' | 'men' => {
  const category = categories.find((c) => c.slug === slug);
  if (!category) return 'default';

  // Walk up to root parent
  let root = category;
  let safety = 10;
  while (root.parent_uuid && safety > 0) {
    const parent = categories.find((c) => c.uuid === root.parent_uuid);
    if (!parent) break;
    root = parent;
    safety--;
  }

  const name = (root.name || '').trim().toLowerCase();
  if (name === 'حريمي' || name === 'حريمى' || name.includes('women') || name.includes('female')) {
    return 'women';
  }
  if (name === 'رجالي' || name === 'رجالى' || name.includes('men') || name.includes('male')) {
    return 'men';
  }
  return 'default';
};

export const StorefrontProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTheme, setActiveThemeState] = useState<'default' | 'women' | 'men'>('default');
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  const { data: settingsData, isLoading: isSettingsLoading } = usePublicSettings();
  const { data: categoriesData } = usePublicCategories();
  const { data: themeData, isLoading: isThemeLoading } = usePublicTheme(activeTheme);

  // Detect theme from URL or fallback to localStorage
  useEffect(() => {
    setIsMounted(true);
    if (!pathname) return;

    const match = pathname.match(/\/category\/([^\/]+)/);
    if (match && categoriesData) {
      const slug = decodeURIComponent(match[1]);
      const detectedTheme = detectThemeFromCategory(slug, categoriesData);
      setActiveThemeState(detectedTheme);
      return;
    }

    // Not on a category page — use localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eva-theme') as 'default' | 'women' | 'men' | null;
      if (saved === 'default' || saved === 'women' || saved === 'men') {
        setActiveThemeState(saved);
      } else {
        setActiveThemeState('default');
      }
    }
  }, [pathname, categoriesData]);

  const setActiveTheme = (theme: 'default' | 'women' | 'men') => {
    setActiveThemeState(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eva-theme', theme);
    }
  };

  const settings = (settingsData || []).reduce((acc, curr) => {
    acc[curr.setting_key] = curr.setting_value;
    return acc;
  }, {} as Record<string, string | null>);

  const themeConfig: ThemeApiResponse | null = themeData || null;
  const isLoading = isSettingsLoading || isThemeLoading || !isMounted;

  // Inject CSS variables whenever themeConfig changes
  useEffect(() => {
    if (!themeConfig) return;
    const root = document.documentElement;
    const c = themeConfig.colors;
    const bg = themeConfig.background;

    // Primary theme variables
    root.style.setProperty('--eva-primary', c.primary);
    root.style.setProperty('--eva-secondary', c.secondary);
    root.style.setProperty('--eva-accent', c.accent);
    root.style.setProperty('--eva-text', c.text);
    root.style.setProperty('--eva-bg-1', bg.color_1);
    root.style.setProperty('--eva-bg-2', bg.color_2);

    // Contrast foreground colors
    root.style.setProperty('--eva-primary-foreground', getContrastColor(c.primary));
    root.style.setProperty('--eva-accent-foreground', getContrastColor(c.accent));

    // Shadcn compatibility (some components read these)
    root.style.setProperty('--primary', c.primary);
    root.style.setProperty('--primary-foreground', getContrastColor(c.primary));
    root.style.setProperty('--accent', c.accent);
    root.style.setProperty('--accent-foreground', getContrastColor(c.accent));

    // Animation variables
    root.style.setProperty('--eva-anim-speed', String(bg.animation_speed));
    root.style.setProperty('--eva-anim-blur', String(bg.animation_blur));
    root.style.setProperty('--eva-anim-opacity', String(bg.animation_opacity));
    root.style.setProperty('--eva-anim-blobs', String(bg.animation_blobs_count));
  }, [themeConfig]);

  return (
    <StorefrontContext.Provider value={{ settings, themeConfig, activeTheme, setActiveTheme, isLoading }}>
      <NextTopLoader height={3} color="var(--eva-primary)" showSpinner={false} />
      {children}
    </StorefrontContext.Provider>
  );
};
