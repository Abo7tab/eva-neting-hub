import { Product, PaginatedProducts, ProductsListParams } from '@/features/products/types/product.types';
import { Category } from '@/features/categories/types/category.types';
import { Brand } from '@/features/brands/types/brand.types';
import { SiteSetting } from '@/features/settings/types/settings.types';
import { ThemeConfig } from '@/features/theme/types/theme.types';

export interface CheckoutPayload {
  customer_name?: string;
  customer_phone?: string;
  items: {
    product_uuid: string;
    quantity: number;
  }[];
}

export interface CheckoutResponse {
  whatsapp_url: string; // The wa.me URL
  reference_code: string;
}
