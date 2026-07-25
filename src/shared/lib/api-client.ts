import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getToken, useAuthStore } from "@/shared/stores/auth.store";
import type { ApiMeta } from "@/shared/types/api.types";

declare module 'axios' {
  export interface AxiosResponse<T = any, D = any> {
    data: T;
    meta?: ApiMeta;
    message?: string;
  }
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const envelope = response.data;
    // If it's our standard envelope format
    if (envelope && typeof envelope === 'object' && 'success' in envelope) {
      response.data = envelope.data;
      (response as any).meta = envelope.meta;
      (response as any).message = envelope.message;
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        useAuthStore.getState().clearAuth();
        if (window.location.pathname !== "/admin/login") {
          window.location.href = "/admin/login";
        }
      }
    }
    return Promise.reject(extractError(error));
  }
);

export function extractError(error: any) {
  if (axios.isAxiosError(error) && error.response?.data) {
    return error.response.data;
  }
  return {
    success: false,
    message: error.message || "An unexpected error occurred",
  };
}
