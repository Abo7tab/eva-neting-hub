import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchAllThemeSettings, updateThemeSettings, uploadLogo } from "../api/theme.api";
import type { ApiError } from "@/shared/types/api.types";
import type { ThemeConfig, ThemeName } from "../types/theme.types";

export const THEME_SETTINGS_QUERY_KEY = ["theme-settings"];

export function useThemeSettings() {
  return useQuery({
    queryKey: THEME_SETTINGS_QUERY_KEY,
    queryFn: fetchAllThemeSettings,
  });
}

export function useUpdateTheme() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ themeName, config }: { themeName: ThemeName; config: ThemeConfig }) => {
      return updateThemeSettings(themeName, config);
    },
    onSuccess: () => {
      toast.success("تم حفظ إعدادات الثيم بنجاح");
      queryClient.invalidateQueries({ queryKey: THEME_SETTINGS_QUERY_KEY });
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "حدث خطأ أثناء حفظ الإعدادات");
    },
  });
}

export function useUploadLogo() {
  return useMutation({
    mutationFn: async (file: File) => {
      return uploadLogo(file);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "حدث خطأ أثناء رفع اللوجو");
    },
  });
}
