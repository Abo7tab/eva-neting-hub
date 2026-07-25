"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Admin } from "@/shared/types/auth.types";

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (admin: Admin, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      setAuth: (admin: Admin, token: string) =>
        set({ admin, token, isAuthenticated: true }),
      clearAuth: () => set({ admin: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'eva-admin-auth-storage',
    }
  )
);

// Helper function to read token outside of React components
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const storageData = localStorage.getItem("eva-admin-auth-storage");
    if (!storageData) return null;
    const parsed = JSON.parse(storageData);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
}
