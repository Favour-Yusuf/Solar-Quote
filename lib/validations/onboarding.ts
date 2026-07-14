import { z } from "zod";

export const onboardingSchema = z.object({
  companyName: z.string().min(1, "Enter your company name."),
  phone: z.string().optional(),
  email: z.union([z.email("Enter a valid email address."), z.literal("")]).optional(),
  address: z.string().optional(),
  logoUrl: z.string().optional(),
  productKeys: z.array(z.string()),
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
});
export type OnboardingInput = z.infer<typeof onboardingSchema>;
