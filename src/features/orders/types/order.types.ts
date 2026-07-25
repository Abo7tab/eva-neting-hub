export type OrderStatus = 'pending' | 'redirected' | 'completed' | 'failed';

export interface OrderLogItem {
  id: number;
  order_log_id: number;
  product_id: number;
  product_name_snapshot: string;
  product_slug_snapshot: string;
  product_image_snapshot: string | null;
  quantity: number;
  unit_price: string;
  line_total: string;
  created_at: string;
  updated_at: string;
}

export interface OrderLog {
  uuid: string;
  reference_code: string;
  customer_name: string | null;
  customer_phone: string | null;
  total_items: number;
  subtotal: string;
  total_price: string;
  whatsapp_number_id: number;
  assigned_phone_number: string;
  checkout_message: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  items?: OrderLogItem[];
}

export interface OrdersListParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  sort_by?: string;
}

export interface OrderStats {
  pending: number;
  redirected: number;
  completed: number;
  failed: number;
}
