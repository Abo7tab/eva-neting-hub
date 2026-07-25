import { z } from 'zod';

export const categoryFormSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(255),
  slug: z.string().max(255).optional().or(z.literal('')),
  description: z.string().max(1000).optional().or(z.literal('')),
  parent_uuid: z.string().uuid('القسم الأب غير صالح').optional().or(z.literal('')),
  cover_image_url: z.string().url().optional().or(z.literal('')),
  storage_public_id: z.string().optional().or(z.literal('')),
  seo_title: z.string().max(255).optional().or(z.literal('')),
  meta_description: z.string().max(320).optional().or(z.literal('')),
  active_status: z.boolean(),
  sort_order: z.coerce.number().int().min(0),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
