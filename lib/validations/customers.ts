import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(1, "Enter the customer's name."),
  businessName: z.string().optional(),
  phone: z.string().optional(),
  email: z.union([z.email("Enter a valid email address."), z.literal("")]).optional(),
  address: z.string().optional(),
});
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
