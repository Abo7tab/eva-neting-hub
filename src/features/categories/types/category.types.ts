export interface Category {
  uuid: string;
  parent_uuid: string | null;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  storage_public_id?: string | null; // Only available in admin context
  seo_title: string | null;
  meta_description: string | null;
  active_status: boolean;
  sort_order: number;
  products_count?: number; // Added via withCount('products') in admin list
  created_at: string;
  updated_at: string;
  parent?: Category;
  children?: Category[];
}

export interface CategoryTreeNode extends Category {
  level: number;
  isExpanded?: boolean;
  children?: CategoryTreeNode[];
}

export interface CategoriesListParams {
  search?: string;
  page?: number;
  per_page?: number;
}

export interface PaginatedCategories {
  data: Category[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
