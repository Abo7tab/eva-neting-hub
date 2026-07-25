export interface Product {
  uuid: string;
  name: string;
  slug: string;
  sku: string | null;
  short_description: string | null;
  description: string | null;
  weight: string | null;
  weight_unit: string;
  price: string;
  compare_at_price: string | null;
  stock_quantity: number;
  cover_image_url: string | null;
  storage_public_id?: string | null;
  is_trending: boolean;
  is_featured: boolean;
  views_count: number;
  sort_order: number;
  active_status: boolean;
  seo_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  brand?: {
    uuid: string;
    name: string;
    slug: string;
  };
  category?: {
    uuid: string;
    name: string;
    slug: string;
  };
  images?: ProductImage[];
}

export interface ProductImage {
  uuid: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

export interface ProductsListParams {
  search?: string;
  brand_uuid?: string;
  category_uuid?: string;
  is_trending?: boolean;
  is_featured?: boolean;
  active_status?: boolean;
  sort_by?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular';
  page?: number;
  per_page?: number;
}

export interface PaginatedProducts {
  data: Product[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
