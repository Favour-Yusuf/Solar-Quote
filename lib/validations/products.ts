import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Enter a product name."),
  unit: z.string().min(1, "Enter a unit (e.g. panel)."),
  price: z.number("Enter a price.").positive("Enter a price greater than 0."),
});
export type ProductFormInput = z.infer<typeof productFormSchema>;
