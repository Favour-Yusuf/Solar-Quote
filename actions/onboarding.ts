"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { onboardingSchema } from "@/lib/validations/onboarding";
import { completeOnboarding } from "@/services/companies";
import { STARTER_PRODUCTS } from "@/features/onboarding/constants";
import type { ActionResult } from "@/actions/auth";

export async function completeOnboardingAction(input: unknown): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Your session expired. Please log in again." };
  }

  const parsed = onboardingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Please check the fields and try again." };
  }

  const products = STARTER_PRODUCTS.filter((p) =>
    parsed.data.productKeys.includes(p.key)
  ).map(({ name, unit, priceCents }) => ({ name, unit, priceCents }));

  await completeOnboarding(user.id, { ...parsed.data, products });

  redirect("/quotes/new");
}
