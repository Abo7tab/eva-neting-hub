'use client';

import { createContext, useContext, useEffect, useState } from 'react';
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

export const StorefrontProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTheme, setActiveThemeState] = useState<string>('default');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem('eva-theme');
    if (savedTheme) setActiveThemeState(savedTheme);
  }, []);

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
  // Backend returns: { colors: { primary, secondary, accent, text }, background: { color_1, color_2, ... } }
  useEffect(() => {
    if (!themeConfig) return;

    const root = document.documentElement;
    root.style.setProperty('--eva-primary', themeConfig.colors.primary);
    root.style.setProperty('--eva-secondary', themeConfig.colors.secondary);
    root.style.setProperty('--eva-accent', themeConfig.colors.accent);
    root.style.setProperty('--eva-text', themeConfig.colors.text);
    root.style.setProperty('--eva-bg-1', themeConfig.background.color_1);
    root.style.setProperty('--eva-bg-2', themeConfig.background.color_2);
  }, [themeConfig, activeTheme]);

  return (
    <StorefrontContext.Provider value={{ settings, themeConfig, activeTheme, setActiveTheme, isLoading }}>
      {children}
      <NextTopLoader
        height={4}
        color="var(--eva-primary, #F97316)"
        showSpinner={false}
      />
    </StorefrontContext.Provider>
  );
};
