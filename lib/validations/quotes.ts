import { z } from "zod";
import { isCurrencyCode } from "@/lib/currency";

export const createQuoteSchema = z.object({
  customerId: z.string().min(1, "Select a customer."),
  depositPercent: z.number().int().min(0).max(100),
  currency: z.string().refine((v): boolean => isCurrencyCode(v), "Choose a supported currency."),
  validUntil: z.coerce.date().optional(),
  notes: z.string().optional(),
  sourcePackageId: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        qty: z.number().int().min(1),
        priceCentsOverride: z.number().int().min(0).optional(),
      })
    )
    .min(1, "Add at least one product."),
});
export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
