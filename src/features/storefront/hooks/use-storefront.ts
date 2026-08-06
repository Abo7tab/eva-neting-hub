import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { storefrontApi } from '../api/storefront.api';
import { ProductsListParams } from '@/features/products/types/product.types';
import { CheckoutPayload } from '../types/storefront.types';

export const usePublicSettings = () => {
  return useQuery({
    queryKey: ['public-settings'],
    queryFn: storefrontApi.getSettings,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const usePublicTheme = (themeName: string) => {
  return useQuery({
    queryKey: ['public-theme', themeName],
    queryFn: () => storefrontApi.getTheme(themeName),
    staleTime: 0,
    refetchOnMount: 'always',
    enabled: !!themeName,
  });
};

export const usePublicCategories = () => {
  return useQuery({
    queryKey: ['public-categories'],
    queryFn: storefrontApi.getCategories,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePublicCategory = (slug: string) => {
  return useQuery({
    queryKey: ['public-category', slug],
    queryFn: () => storefrontApi.getCategory(slug),
    enabled: !!slug,
  });
};

export const usePublicProducts = (params?: ProductsListParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['public-products', params],
    queryFn: () => storefrontApi.getProducts(params),
    enabled,
  });
};

export const usePublicInfiniteProducts = (params?: ProductsListParams) => {
  return useInfiniteQuery({
    queryKey: ['public-products-infinite', params],
    queryFn: ({ pageParam = 1 }) => storefrontApi.getProducts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta) return undefined;
      return lastPage.meta.current_page < lastPage.meta.last_page ? lastPage.meta.current_page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const usePublicProduct = (slug: string) => {
  return useQuery({
    queryKey: ['public-product', slug],
    queryFn: () => storefrontApi.getProduct(slug),
    enabled: !!slug,
  });
};

export const useTrendingProducts = () => {
  return useQuery({
    queryKey: ['public-trending'],
    queryFn: storefrontApi.getTrendingProducts,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['public-featured'],
    queryFn: storefrontApi.getFeaturedProducts,
  });
};

export const usePublicBrands = () => {
  return useQuery({
    queryKey: ['public-brands'],
    queryFn: storefrontApi.getBrands,
    staleTime: 1000 * 60 * 60,
  });
};

export const useCheckout = () => {
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => storefrontApi.checkout(payload),
  });
};
