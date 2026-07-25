import { apiClient } from '@/shared/lib/api-client';
import type { RecentOrder, TopProduct } from '../types/dashboard.types';

// Fetch recent orders
export async function fetchRecentOrders(): Promise<RecentOrder[]> {
  const response = await apiClient.get<RecentOrder[]>('/admin/orders', {
    params: { per_page: 5, sort_by: 'newest' }
  });
  return response.data;
}

// Fetch all products (for stats + top viewed)
export async function fetchProductsForDashboard(): Promise<any[]> {
  const response = await apiClient.get<any[]>('/products', {
    params: { per_page: 100 }
  });
  return response.data;
}

// Fetch top viewed products
export async function fetchTopViewedProducts(): Promise<TopProduct[]> {
  const response = await apiClient.get<TopProduct[]>('/products', {
    params: { sort_by: 'popular', per_page: 5 }
  });
  return response.data;
}

// Fetch trending products count
export async function fetchTrendingProducts(): Promise<any[]> {
  const response = await apiClient.get<any[]>('/products/trending');
  return response.data;
}

// Fetch WhatsApp numbers
export async function fetchWhatsAppNumbers(): Promise<any[]> {
  const response = await apiClient.get<any[]>('/admin/whatsapp-numbers');
  return response.data;
}

// Fetch categories with product counts
export async function fetchCategoriesWithCounts(): Promise<any[]> {
  const response = await apiClient.get<any[]>('/categories');
  return response.data;
}
