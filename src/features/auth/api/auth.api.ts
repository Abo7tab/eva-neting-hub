import { apiClient } from "@/shared/lib/api-client";
import type { LoginPayload, LoginResponse, Admin } from "@/shared/types/auth.types";

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/admin/login', payload);
  return response.data;
}

export async function logoutRequest(): Promise<void> {
  await apiClient.post('/admin/logout');
}

export async function getCurrentAdmin(): Promise<Admin> {
  const response = await apiClient.get<Admin>('/admin/me');
  return response.data;
}
