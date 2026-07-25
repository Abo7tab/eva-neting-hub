"use client";

import { useQuery } from '@tanstack/react-query';
import {
  fetchRecentOrders,
  fetchProductsForDashboard,
  fetchTopViewedProducts,
  fetchTrendingProducts,
  fetchWhatsAppNumbers,
  fetchCategoriesWithCounts,
} from '../api/dashboard.api';

export function useRecentOrders() {
  return useQuery({
    queryKey: ['dashboard', 'recent-orders'],
    queryFn: fetchRecentOrders,
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useProductsForDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'products'],
    queryFn: fetchProductsForDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTopViewedProducts() {
  return useQuery({
    queryKey: ['dashboard', 'top-viewed'],
    queryFn: fetchTopViewedProducts,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTrendingProducts() {
  return useQuery({
    queryKey: ['dashboard', 'trending'],
    queryFn: fetchTrendingProducts,
    staleTime: 5 * 60 * 1000,
  });
}

export function useWhatsAppNumbers() {
  return useQuery({
    queryKey: ['dashboard', 'whatsapp-numbers'],
    queryFn: fetchWhatsAppNumbers,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategoriesWithCounts() {
  return useQuery({
    queryKey: ['dashboard', 'categories'],
    queryFn: fetchCategoriesWithCounts,
    staleTime: 10 * 60 * 1000,
  });
}
