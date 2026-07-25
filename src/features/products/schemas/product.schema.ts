import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(255),
  sku: z.string().max(100).optional().or(z.literal('')),
  brand_uuid: z.string().min(1, 'اختر البراند'),
  category_uuid: z.string().min(1, 'اختر القسم'),
  short_description: z.string().max(500).optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  weight: z.coerce.number().min(0).optional(),
  weight_unit: z.enum(['ml', 'g', 'kg', 'piece']),
  price: z.coerce.number().min(0, 'السعر مطلوب'),
  compare_at_price: z.coerce.number().min(0).optional().nullable(),
  stock_quantity: z.coerce.number().int().min(0),
  cover_image_url: z.string().url().optional().or(z.literal('')),
  storage_public_id: z.string().optional().or(z.literal('')),
  is_trending: z.boolean(),
  is_featured: z.boolean(),
  active_status: z.boolean(),
  seo_title: z.string().max(255).optional().or(z.literal('')),
  meta_description: z.string().max(320).optional().or(z.literal('')),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
