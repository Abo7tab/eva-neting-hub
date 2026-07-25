import { z } from 'zod';

export const brandFormSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(255),
  slug: z.string().max(255).optional().or(z.literal('')),
  description: z.string().max(1000).optional().or(z.literal('')),
  logo_url: z.string().url().optional().or(z.literal('')),
  storage_public_id: z.string().optional().or(z.literal('')),
  seo_title: z.string().max(255).optional().or(z.literal('')),
  meta_description: z.string().max(320).optional().or(z.literal('')),
  active_status: z.boolean(),
  sort_order: z.coerce.number().int().min(0),
});

export type BrandFormData = z.infer<typeof brandFormSchema>;
