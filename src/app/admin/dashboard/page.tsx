"use client";

import { Package, ShoppingCart, TrendingUp, MessageCircle } from 'lucide-react';
import { StatCard } from '@/features/dashboard/components/stat-card';
import { OrdersChart } from '@/features/dashboard/components/orders-chart';
import { CategoriesChart } from '@/features/dashboard/components/categories-chart';
import { RecentOrdersTable } from '@/features/dashboard/components/recent-orders-table';
import { TopProductsList } from '@/features/dashboard/components/top-products-list';
import {
  useRecentOrders,
  useProductsForDashboard,
  useTopViewedProducts,
  useTrendingProducts,
  useWhatsAppNumbers,
  useCategoriesWithCounts,
} from '@/features/dashboard/hooks/use-dashboard-data';

export default function DashboardPage() {
  const { data: orders, isLoading: ordersLoading } = useRecentOrders();
  const { data: products, isLoading: productsLoading } = useProductsForDashboard();
  const { data: topProducts, isLoading: topLoading } = useTopViewedProducts();
  const { data: trending, isLoading: trendingLoading } = useTrendingProducts();
  const { data: whatsappNumbers, isLoading: waLoading } = useWhatsAppNumbers();
  const { data: categories, isLoading: catLoading } = useCategoriesWithCounts();

  // Calculate stats
  const todayOrders = orders?.filter(o => {
    const today = new Date().toDateString();
    return new Date(o.created_at).toDateString() === today;
  }).length || 0;

  const activeWaNumbers = whatsappNumbers?.filter(n => n.is_active).length || 0;

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="طلبات اليوم"
          value={todayOrders}
          icon={ShoppingCart}
          color="rose"
          isLoading={ordersLoading}
          delay={0}
        />
        <StatCard
          title="إجمالي المنتجات"
          value={products?.length || 0}
          icon={Package}
          color="blue"
          isLoading={productsLoading}
          delay={0.1}
        />
        <StatCard
          title="المنتجات الرائجة"
          value={trending?.length || 0}
          icon={TrendingUp}
          color="amber"
          isLoading={trendingLoading}
          delay={0.2}
        />
        <StatCard
          title="أرقام واتساب نشطة"
          value={activeWaNumbers}
          icon={MessageCircle}
          color="emerald"
          isLoading={waLoading}
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OrdersChart orders={orders} isLoading={ordersLoading} />
        <CategoriesChart 
          products={products} 
          categories={categories} 
          isLoading={productsLoading || catLoading} 
        />
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={orders} isLoading={ordersLoading} />
        </div>
        <div className="lg:col-span-1">
          <TopProductsList products={topProducts} isLoading={topLoading} />
        </div>
      </div>
    </div>
  );
}
