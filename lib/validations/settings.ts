import { z } from "zod";
import { isCurrencyCode } from "@/lib/currency";

export const VALIDITY_DAY_OPTIONS = [7, 14, 30, 45, 60, 90] as const;

export const companySettingsSchema = z.object({
  name: z.string().min(1, "Enter your company name."),
  phone: z.string().optional(),
  email: z.union([z.email("Enter a valid email address."), z.literal("")]).optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  logoUrl: z.string().optional(),
  brandColor: z
    .union([z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #1c8a4c."), z.literal("")])
    .optional(),
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  // Kept as plain strings so react-hook-form's field types stay simple; the
  // action coerces defaultValidityDays to a number before persisting.
  defaultCurrency: z
    .string()
    .refine((v): boolean => isCurrencyCode(v), "Choose a supported currency."),
  defaultValidityDays: z
    .string()
    .refine(
      (v) => (VALIDITY_DAY_OPTIONS as readonly number[]).includes(Number(v)),
      "Choose a validity period."
    ),
});
export type CompanySettingsInput = z.infer<typeof companySettingsSchema>;

export const accountSettingsSchema = z.object({
  fullName: z.string().min(1, "Enter your full name."),
});
export type AccountSettingsInput = z.infer<typeof accountSettingsSchema>;

export const changePasswordSchema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
