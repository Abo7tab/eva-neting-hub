export interface DashboardStats {
  todayOrders: number;
  todayOrdersChange: number;
  totalProducts: number;
  totalProductsChange: number;
  trendingProducts: number;
  activeWhatsAppNumbers: number;
}

export interface OrdersChartData {
  date: string;
  count: number;
}

export interface CategoryChartData {
  category: string;
  count: number;
}

export interface RecentOrder {
  uuid: string;
  reference_code: string;
  customer_name: string | null;
  customer_phone: string | null;
  total_items: number;
  total_price: number;
  status: 'pending' | 'redirected' | 'failed';
  created_at: string;
}

export interface TopProduct {
  uuid: string;
  name: string;
  slug: string;
  views_count: number;
  cover_image_url: string | null;
  price: number;
}
