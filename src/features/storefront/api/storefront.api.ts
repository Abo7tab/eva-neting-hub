import { apiClient } from '@/shared/lib/api-client';
import { Product, PaginatedProducts, ProductsListParams } from '@/features/products/types/product.types';
import { Category } from '@/features/categories/types/category.types';
import { Brand } from '@/features/brands/types/brand.types';
import { SiteSetting } from '@/features/settings/types/settings.types';
import { ThemeApiResponse } from '@/features/theme/types/theme.types';
import { CheckoutPayload, CheckoutResponse } from '../types/storefront.types';

export const storefrontApi = {
  // Products
  getProducts: async (params?: ProductsListParams): Promise<PaginatedProducts> => {
    const response = await apiClient.get('/products', { params });
    // If backend returns { data, meta }, the interceptor will map it properly.
    // We construct it manually in case interceptor strips it:
    if (Array.isArray(response.data)) {
        return { data: response.data, meta: (response as any).meta };
    }
    return response.data;
  },
  
  getTrendingProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/products/trending');
    return response.data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/products/featured');
    return response.data;
  },

  getProduct: async (slug: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${slug}`);
    return response.data;
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  getCategory: async (slug: string): Promise<Category> => {
    const response = await apiClient.get(`/categories/${slug}`);
    return response.data;
  },

  // Brands
  getBrands: async (): Promise<Brand[]> => {
    // There isn't a public /brands route explicitly documented, but the plan says GET /api/v1/brands exists.
    // If it doesn't, we will fix it later.
    const response = await apiClient.get('/brands');
    return response.data;
  },

  // Settings
  getSettings: async (): Promise<SiteSetting[]> => {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  // Theme
  getTheme: async (theme: string): Promise<ThemeApiResponse> => {
    const response = await apiClient.get(`/public/theme/${theme}`);
    return response.data;
  },

  // Checkout
  checkout: async (payload: CheckoutPayload): Promise<CheckoutResponse> => {
    const response = await apiClient.post('/checkout', payload);
    return response.data;
  },
};
