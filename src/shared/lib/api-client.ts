import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getToken, useAuthStore } from "@/shared/stores/auth.store";
import type { ApiError, ApiMeta } from "@/shared/types/api.types";

declare module "axios" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  export interface AxiosResponse<T = any, D = any> {
    data: T;
    meta?: ApiMeta;
    message?: string;
  }
}

type ApiEnvelope<T = unknown> = {
  success: boolean;
  data: T;
  meta?: ApiMeta;
  message?: string;
};

function isApiEnvelope(value: unknown): value is ApiEnvelope {
  return Boolean(value && typeof value === "object" && "success" in value);
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://beauty.alwaysdata.net/api/v1",
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
    if (isApiEnvelope(envelope)) {
      response.data = envelope.data;
      response.meta = envelope.meta;
      response.message = envelope.message;
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

export function extractError(error: unknown): ApiError {
  if (axios.isAxiosError(error) && error.response?.data) {
    return error.response.data as ApiError;
  }

  const message = error instanceof Error ? error.message : "An unexpected error occurred";

  return {
    success: false,
    message,
  };
}
