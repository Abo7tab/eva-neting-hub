export interface AdminUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AdminsListParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export interface CreateAdminPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateAdminPayload {
  name?: string;
  email?: string;
}

export interface ResetPasswordPayload {
  password: string;
  password_confirmation: string;
}
