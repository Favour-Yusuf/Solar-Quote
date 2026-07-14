"use server";

import { revalidatePath } from "next/cache";
import { requireOnboardedCompany } from "@/lib/session";
import { productFormSchema } from "@/lib/validations/products";
import { createProduct, updateProduct } from "@/services/products";
import type { ActionResult } from "@/actions/auth";

export async function createProductAction(input: unknown): Promise<ActionResult> {
  const { company } = await requireOnboardedCompany();

  const parsed = productFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  await createProduct({
    companyId: company.id,
    name: parsed.data.name,
    unit: parsed.data.unit,
    priceCents: Math.round(parsed.data.price * 100),
  });
  revalidatePath("/products");
  return { success: true };
}

export async function updateProductAction(
  productId: string,
  input: unknown
): Promise<ActionResult> {
  const { company } = await requireOnboardedCompany();

  const parsed = productFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const ok = await updateProduct(productId, company.id, {
    name: parsed.data.name,
    unit: parsed.data.unit,
    priceCents: Math.round(parsed.data.price * 100),
  });
  if (!ok) return { error: "Product not found." };

  revalidatePath("/products");
  return { success: true };
}
