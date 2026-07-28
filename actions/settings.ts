"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireOnboardedCompany } from "@/lib/session";
import {
  accountSettingsSchema,
  changePasswordSchema,
  companySettingsSchema,
} from "@/lib/validations/settings";
import { updateCompany, updateCompanyLogo } from "@/services/companies";
import { updateUserProfile } from "@/services/users";
import { logoPathFromPublicUrl } from "@/lib/supabase/storage";
import type { ActionResult } from "@/actions/auth";

/**
 * Saves a freshly uploaded logo on its own. Revalidates the whole dashboard
 * layout, not just this page, so the sidebar and mobile header pick up the new
 * brand immediately.
 *
 * Accepts only a public URL from this installer's own `logos/<uid>/` folder —
 * the column is rendered through next/image on customer-facing pages, so it
 * must never become a sink for arbitrary third-party URLs.
 */
export async function updateCompanyLogoAction(logoUrl: unknown): Promise<ActionResult> {
  const { user } = await requireOnboardedCompany();

  if (logoUrl !== null && typeof logoUrl !== "string") {
    return { error: "That logo couldn't be saved." };
  }

  if (logoUrl) {
    const path = logoPathFromPublicUrl(logoUrl);
    if (!path || !path.startsWith(`${user.id}/`)) {
      return { error: "That logo couldn't be saved." };
    }
  }

  await updateCompanyLogo(user.id, logoUrl || null);
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateCompanyAction(input: unknown): Promise<ActionResult> {
  const { user } = await requireOnboardedCompany();

  const parsed = companySettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  await updateCompany(user.id, {
    ...parsed.data,
    defaultValidityDays: Number(parsed.data.defaultValidityDays),
  });
  // Layout-wide: company name, logo and brand colour drive the sidebar and
  // header on every authenticated page, not just /settings.
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateAccountAction(input: unknown): Promise<ActionResult> {
  const { user } = await requireOnboardedCompany();

  const parsed = accountSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  await updateUserProfile(user.id, parsed.data);
  revalidatePath("/settings");
  return { success: true };
}

export async function changePasswordAction(input: unknown): Promise<ActionResult> {
  await requireOnboardedCompany();

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
