"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/field-error";
import { requestPasswordResetAction } from "@/actions/auth";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(data: ForgotPasswordInput) {
    setFormError(null);
    const result = await requestPasswordResetAction(data);
    if (result && "error" in result) {
      setFormError(result.error);
      return;
    }
    setSubmittedEmail(data.email);
  }

  async function resend() {
    const email = submittedEmail ?? getValues("email");
    if (email) await requestPasswordResetAction({ email });
  }

  if (submittedEmail) {
    return (
      <div className="rounded-[20px] border border-border bg-card p-9 text-left">
        <div className="mx-auto mb-4.5 flex size-13 items-center justify-center rounded-full bg-success">
          <Check className="size-6 text-success-foreground" strokeWidth={2.4} />
        </div>
        <h1 className="text-center font-heading text-[19px] font-extrabold">
          Check your email
        </h1>
        <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">
          We sent a reset link to {submittedEmail}. It expires in 30 minutes.
        </p>
        <div className="mt-5.5 flex flex-col items-center gap-4">
          <Button
            variant="link"
            onClick={resend}
            className="h-auto p-0 text-[13.5px] font-semibold"
          >
            Resend email
          </Button>
          <Link href="/login" className="text-sm font-semibold text-primary">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] border border-border bg-card p-9 text-left">
      <h1 className="font-heading text-[20px] font-extrabold">
        Reset your password
      </h1>
      <p className="mt-2 mb-5.5 text-sm leading-relaxed text-muted-foreground">
        Enter your email and we&apos;ll send you a link to get back in.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="email" className="mb-1.5 text-[13px] font-semibold">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
        <FieldError message={formError ?? undefined} />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 h-11 w-full rounded-xl text-[15px] font-bold"
        >
          {isSubmitting ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm font-semibold text-primary">
          Back to login
        </Link>
      </div>
    </div>
  );
}
