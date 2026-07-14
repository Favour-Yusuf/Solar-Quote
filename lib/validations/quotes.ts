import { z } from "zod";

export const createQuoteSchema = z.object({
  customerId: z.string().min(1, "Select a customer."),
  depositPercent: z.number().int().min(0).max(100),
  notes: z.string().optional(),
  items: z
    .array(z.object({ productId: z.string().min(1), qty: z.number().int().min(1) }))
    .min(1, "Add at least one product."),
});
export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
