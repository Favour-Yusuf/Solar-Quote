import { z } from "zod";

export const packageItemSchema = z.object({
  productId: z.string().min(1),
  qty: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  customPriceCents: z.coerce.number().int().min(0).optional(),
});
export type PackageItemInput = z.infer<typeof packageItemSchema>;

export const packageFormSchema = z.object({
  name: z.string().min(1, "Enter a package name."),
  description: z.string().optional(),
  category: z.string().optional(),
  coverImageUrl: z.string().optional(),
  depositPercent: z.coerce.number().int().min(0).max(100),
  isActive: z.boolean(),
  items: z.array(packageItemSchema).min(1, "Add at least one product."),
});
export type PackageFormInput = z.infer<typeof packageFormSchema>;
