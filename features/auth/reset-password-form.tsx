"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/field-error";
import { resetPasswordAction } from "@/actions/auth";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth";

export function ResetPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  async function onSubmit(data: ResetPasswordInput) {
    setFormError(null);
    const result = await resetPasswordAction(data);
    if (result && "error" in result) {
      setFormError(result.error);
    }
  }

  return (
    <div className="rounded-[20px] border border-border bg-card p-9 text-left">
      <h1 className="font-heading text-[20px] font-extrabold">
        Set a new password
      </h1>
      <p className="mt-2 mb-5.5 text-sm leading-relaxed text-muted-foreground">
        Choose a new password for your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
        <div>
          <Label htmlFor="password" className="mb-1.5 text-[13px] font-semibold">
            New password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
            {...register("password")}
          />
          <FieldError message={errors.password?.message} />
        </div>
        <div>
          <Label htmlFor="confirmPassword" className="mb-1.5 text-[13px] font-semibold">
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
            {...register("confirmPassword")}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        <FieldError message={formError ?? undefined} />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 h-11 rounded-xl text-[15px] font-bold"
        >
          {isSubmitting ? "Saving…" : "Save new password"}
        </Button>
      </form>
    </div>
  );
}
