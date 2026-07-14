"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";
import { createCompany } from "@/services/companies";
import { upsertUser } from "@/services/users";

export type ActionResult = { error: string } | { success: true };

export type SignInResult = ActionResult | { error: string; unconfirmedEmail: string };

export async function signInAction(input: unknown): Promise<SignInResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        error: "Confirm your email address before logging in.",
        unconfirmedEmail: parsed.data.email,
      };
    }
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signUpAction(input: unknown): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Please check the fields below and try again." };
  }
  const { fullName, companyName, email, password } = parsed.data;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) {
    return { error: error.message };
  }
  if (!data.user) {
    return { error: "Something went wrong creating your account. Please try again." };
  }

  await upsertUser({ id: data.user.id, email, fullName });
  await createCompany({ ownerId: data.user.id, name: companyName });

  if (!data.session) {
    redirect(`/verify-email?email=${encodeURIComponent(email)}`);
  }

  redirect("/onboarding");
}

export async function resendVerificationEmailAction(email: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({ type: "signup", email });
  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

export async function requestPasswordResetAction(input: unknown): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/reset-password`,
  });
  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function resetPasswordAction(input: unknown): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Use at least 8 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
