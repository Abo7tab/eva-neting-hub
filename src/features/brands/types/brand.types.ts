export interface Brand {
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  storage_public_id?: string | null; // Only available in admin context
  seo_title: string | null;
  meta_description: string | null;
  active_status: boolean;
  sort_order: number;
  products_count?: number; // Added via withCount('products') in admin list
  created_at: string;
  updated_at: string;
}

export interface BrandsListParams {
  search?: string;
  page?: number;
  per_page?: number;
}

export interface PaginatedBrands {
  data: Brand[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
