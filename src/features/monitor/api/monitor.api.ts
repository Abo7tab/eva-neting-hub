import { apiClient } from '@/shared/lib/api-client';

export interface ServerHealth {
  current_concurrent: number;
  max_concurrent_limit: number;
  concurrency_percentage: number;
  total_requests_served: number;
  rate_limit_hits_total: number;
  rate_limit_hits_today: number;
  admission_rejections_total: number;
  admission_rejections_today: number;
  last_request_at: string | null;
  php_version: string;
  laravel_version: string;
}

export async function fetchServerHealth(): Promise<ServerHealth> {
  const response = await apiClient.get('/admin/health');
  return response.data as ServerHealth;
}
