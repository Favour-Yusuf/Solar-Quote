"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/field-error";
import { signInAction, resendVerificationEmailAction } from "@/actions/auth";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export function LoginForm() {
  const searchParams = useSearchParams();
  const justVerified = searchParams.get("verified") === "1";
  const [formError, setFormError] = useState<string | null>(null);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setFormError(null);
    setUnconfirmedEmail(null);
    const result = await signInAction(data);
    if (result && "error" in result) {
      setFormError(result.error);
      if ("unconfirmedEmail" in result) {
        setUnconfirmedEmail(result.unconfirmedEmail);
      }
    }
  }

  async function handleResend() {
    if (!unconfirmedEmail) return;
    setResending(true);
    const result = await resendVerificationEmailAction(unconfirmedEmail);
    setResending(false);
    if (result && "error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success("Verification email sent.");
  }

  return (
    <div>
      <h1 className="font-heading text-[26px] font-extrabold tracking-tight">
        Welcome back
      </h1>
      <p className="mt-2 mb-5 text-[14.5px] text-muted-foreground">
        Log in to keep quoting fast.
      </p>

      {justVerified ? (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-success px-3.5 py-3 text-[13.5px] font-medium text-success-foreground">
          <CircleCheck className="size-4 shrink-0" strokeWidth={2.2} />
          Email verified — you can now log in.
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
        <div>
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
        </div>
        <div>
          <Label htmlFor="password" className="mb-1.5 text-[13px] font-semibold">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
            {...register("password")}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <div className="flex justify-end">
          <Button
            variant="link"
            render={<Link href="/forgot-password" />}
            className="h-auto p-0 text-[13.5px] font-semibold"
          >
            Forgot password?
          </Button>
        </div>

        <FieldError message={formError ?? undefined} />
        {unconfirmedEmail ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="-mt-2 text-left text-[13px] font-semibold text-primary"
          >
            {resending ? "Sending…" : "Resend verification email"}
          </button>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 h-11 rounded-xl text-[15px] font-bold"
        >
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link href="/register" className="font-semibold text-primary">
          Register
        </Link>
      </p>
    </div>
  );
}
