import { apiClient } from '@/shared/lib/api-client';

export interface HourlyTrafficPoint {
  time: string;
  date: string;
  served: number;
  rate_limited: number;
  shed_503: number;
}

export interface DailyTrafficPoint {
  day_name: string;
  date: string;
  full_date: string;
  served: number;
  rate_limited: number;
  shed_503: number;
}

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
  hourly_history: HourlyTrafficPoint[];
  daily_history: DailyTrafficPoint[];
  php_version: string;
  laravel_version: string;
}

export async function fetchServerHealth(): Promise<ServerHealth> {
  const response = await apiClient.get('/admin/health');
  return response.data as ServerHealth;
}

export async function resetHealthCounters(): Promise<{ message: string }> {
  const response = await apiClient.post('/admin/health/reset');
  return response.data as { message: string };
}

export async function clearServerCache(): Promise<{ message: string }> {
  const response = await apiClient.post('/admin/health/clear-cache');
  return response.data as { message: string };
}
