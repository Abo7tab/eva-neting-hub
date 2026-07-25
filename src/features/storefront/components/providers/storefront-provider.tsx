'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { usePublicSettings, usePublicTheme } from '../../hooks/use-storefront';
import { ThemeApiResponse } from '@/features/theme/types/theme.types';
import NextTopLoader from 'nextjs-toploader';

interface StorefrontContextValue {
  settings: Record<string, string | null>;
  themeConfig: ThemeApiResponse | null;
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
  isLoading: boolean;
}

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export const useStorefrontContext = () => {
  const context = useContext(StorefrontContext);
  if (!context) throw new Error('useStorefrontContext must be used within StorefrontProvider');
  return context;
};

// Helper to determine contrast color (white or black) based on hex
const getContrastColor = (hex: string) => {
  if (!hex || !hex.startsWith('#')) return '#FFFFFF';
  const c = hex.substring(1); // strip #
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 128 ? '#FFFFFF' : '#0F172A';
};

export const StorefrontProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTheme, setActiveThemeState] = useState<string>('default');
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    
    // Check URL path first to automatically infer category theme
    if (pathname) {
      const match = pathname.match(/\/category\/([^\/]+)/);
      if (match) {
        const slug = match[1];
        if (slug.includes('women') || slug.includes('حريمي')) {
          setActiveThemeState('women');
          return;
        }
        if (slug.includes('men') || slug.includes('رجالي')) {
          setActiveThemeState('men');
          return;
        }
      }
    }

    // Fallback to localStorage if no specific URL theme applies
    const savedTheme = localStorage.getItem('eva-theme');
    if (savedTheme) setActiveThemeState(savedTheme);
  }, [pathname]);

  const setActiveTheme = (theme: string) => {
    setActiveThemeState(theme);
    localStorage.setItem('eva-theme', theme);
  };

  const { data: settingsData, isLoading: isSettingsLoading } = usePublicSettings();
  const { data: themeData, isLoading: isThemeLoading } = usePublicTheme(activeTheme);

  // Convert settings array to key-value map
  const settings = (settingsData || []).reduce((acc, curr) => {
    acc[curr.setting_key] = curr.setting_value;
    return acc;
  }, {} as Record<string, string | null>);

  // themeData is typed as ThemeApiResponse with nested colors/background
  const themeConfig: ThemeApiResponse | null = themeData || null;

  const isLoading = isSettingsLoading || isThemeLoading || !isMounted;

  // Dynamically inject CSS variables for theme into the document root
  useEffect(() => {
    if (!themeConfig) return;

    const root = document.documentElement;
    const c = themeConfig.colors;

    // 1. EVA Theme Variables
    root.style.setProperty('--eva-primary', c.primary);
    root.style.setProperty('--eva-secondary', c.secondary);
    root.style.setProperty('--eva-accent', c.accent);
    root.style.setProperty('--eva-text', c.text);
    root.style.setProperty('--eva-bg-1', themeConfig.background.color_1);
    root.style.setProperty('--eva-bg-2', themeConfig.background.color_2);
    
    // 2. Shadcn Theme Variables (overriding default oklch to ensure components sync with theme)
    root.style.setProperty('--primary', c.primary);
    root.style.setProperty('--primary-foreground', getContrastColor(c.primary));
    
    root.style.setProperty('--secondary', c.secondary);
    root.style.setProperty('--secondary-foreground', getContrastColor(c.secondary));
    
    root.style.setProperty('--accent', c.accent);
    root.style.setProperty('--accent-foreground', getContrastColor(c.accent));
  }, [themeConfig, activeTheme]);

  return (
    <StorefrontContext.Provider value={{ settings, themeConfig, activeTheme, setActiveTheme, isLoading }}>
      {children}
      <NextTopLoader
        height={4}
        color="var(--primary)"
        showSpinner={false}
      />
    </StorefrontContext.Provider>
  );
};
