"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireOnboardedCompany } from "@/lib/session";
import { packageFormSchema } from "@/lib/validations/packages";
import {
  createPackage,
  deletePackage,
  duplicatePackage,
  toggleFavorite,
  touchLastUsed,
  updatePackage,
} from "@/services/packages";
import type { ActionResult } from "@/actions/auth";

export async function createPackageAction(input: unknown): Promise<ActionResult> {
  const { company } = await requireOnboardedCompany();

  const parsed = packageFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const pkg = await createPackage(company.id, parsed.data);
  redirect(`/packages/${pkg.id}`);
}

export async function updatePackageAction(id: string, input: unknown): Promise<ActionResult> {
  const { company } = await requireOnboardedCompany();

  const parsed = packageFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  await updatePackage(id, company.id, parsed.data);
  revalidatePath("/packages");
  revalidatePath(`/packages/${id}`);
  return { success: true };
}

export async function deletePackageAction(id: string): Promise<ActionResult> {
  const { company } = await requireOnboardedCompany();
  const ok = await deletePackage(id, company.id);
  if (!ok) return { error: "Package not found." };
  revalidatePath("/packages");
  return { success: true };
}

export async function duplicatePackageAction(id: string): Promise<ActionResult> {
  const { company } = await requireOnboardedCompany();
  const copy = await duplicatePackage(id, company.id);
  if (!copy) return { error: "Package not found." };
  revalidatePath("/packages");
  return { success: true };
}

export async function toggleFavoritePackageAction(
  id: string,
  isFavorite: boolean
): Promise<ActionResult> {
  const { company } = await requireOnboardedCompany();
  const ok = await toggleFavorite(id, company.id, isFavorite);
  if (!ok) return { error: "Package not found." };
  revalidatePath("/packages");
  return { success: true };
}

export async function markPackageUsedAction(id: string): Promise<ActionResult> {
  const { company } = await requireOnboardedCompany();
  await touchLastUsed(id, company.id);
  return { success: true };
}
