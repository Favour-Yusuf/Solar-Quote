import { z } from "zod";

export const onboardingSchema = z.object({
  companyName: z.string().min(1, "Enter your company name."),
  phone: z.string().optional(),
  email: z.union([z.email("Enter a valid email address."), z.literal("")]).optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  logoUrl: z.string().optional(),
  brandColor: z
    .union([z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #1c8a4c."), z.literal("")])
    .optional(),
  productKeys: z.array(z.string()),
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
});
export type OnboardingInput = z.infer<typeof onboardingSchema>;
