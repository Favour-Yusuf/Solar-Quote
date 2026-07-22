"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireOnboardedCompany } from "@/lib/session";
import {
  accountSettingsSchema,
  changePasswordSchema,
  companySettingsSchema,
} from "@/lib/validations/settings";
import { updateCompany } from "@/services/companies";
import { updateUserProfile } from "@/services/users";
import type { ActionResult } from "@/actions/auth";

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
  revalidatePath("/settings");
  revalidatePath("/dashboard");
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
