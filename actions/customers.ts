"use server";

import { revalidatePath } from "next/cache";
import type { Customer } from "@prisma/client";
import { requireOnboardedCompany } from "@/lib/session";
import { createCustomerSchema } from "@/lib/validations/customers";
import { createCustomer } from "@/services/customers";

export type CreateCustomerResult = { error: string } | { success: true; customer: Customer };

export async function createCustomerAction(input: unknown): Promise<CreateCustomerResult> {
  const { company } = await requireOnboardedCompany();

  const parsed = createCustomerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const customer = await createCustomer({ companyId: company.id, ...parsed.data });
  revalidatePath("/customers");
  return { success: true, customer };
}
