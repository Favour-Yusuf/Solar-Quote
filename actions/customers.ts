"use server";

import { revalidatePath } from "next/cache";
import { requireOnboardedCompany } from "@/lib/session";
import { createCustomerSchema } from "@/lib/validations/customers";
import { createCustomer } from "@/services/customers";
import type { ActionResult } from "@/actions/auth";

export async function createCustomerAction(input: unknown): Promise<ActionResult> {
  const { company } = await requireOnboardedCompany();

  const parsed = createCustomerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  await createCustomer({ companyId: company.id, ...parsed.data });
  revalidatePath("/customers");
  return { success: true };
}
