"use server";

import { redirect } from "next/navigation";
import { requireOnboardedCompany } from "@/lib/session";
import { createQuoteSchema } from "@/lib/validations/quotes";
import { createQuote, updateQuoteStatus } from "@/services/quotes";
import type { ActionResult } from "@/actions/auth";

export async function createQuoteAction(input: unknown): Promise<ActionResult> {
  const { company } = await requireOnboardedCompany();

  const parsed = createQuoteSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const quote = await createQuote({ companyId: company.id, ...parsed.data });
  redirect(`/quotes/${quote.id}`);
}

export async function markQuoteSentAction(quoteId: string): Promise<ActionResult> {
  const { company } = await requireOnboardedCompany();
  const ok = await updateQuoteStatus(quoteId, company.id, "SENT");
  if (!ok) return { error: "Quote not found." };
  return { success: true };
}

export async function markQuotePaidAction(quoteId: string): Promise<ActionResult> {
  const { company } = await requireOnboardedCompany();
  const ok = await updateQuoteStatus(quoteId, company.id, "PAID");
  if (!ok) return { error: "Quote not found." };
  return { success: true };
}
