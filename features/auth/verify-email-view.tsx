"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/field-error";
import { resendVerificationEmailAction } from "@/actions/auth";

const RESEND_COOLDOWN_SECONDS = 30;

export function VerifyEmailView({
  email,
  confirmError,
}: {
  email: string;
  confirmError?: boolean;
}) {
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  async function handleResend() {
    if (!email) return;
    setResending(true);
    const result = await resendVerificationEmailAction(email);
    setResending(false);
    if (result && "error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success("Verification email sent.");
    setCooldown(RESEND_COOLDOWN_SECONDS);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return (
    <div>
      <div className="mb-6 flex size-13 items-center justify-center rounded-2xl bg-accent">
        <Mail className="size-6 text-accent-foreground" strokeWidth={2} />
      </div>
      <h1 className="font-heading text-[26px] font-extrabold tracking-tight">
        Verify your email
      </h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
        {email ? (
          <>
            We&apos;ve sent a confirmation link to <strong className="font-semibold text-foreground">{email}</strong>.
            Click it to activate your account — then come back and log in.
          </>
        ) : (
          "We've sent a confirmation link to your email. Click it to activate your account."
        )}
      </p>

      {confirmError ? (
        <div className="mt-4">
          <FieldError message="That confirmation link didn't work — it may have expired. Request a new one below." />
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-2.5">
        <Button
          onClick={handleResend}
          disabled={resending || cooldown > 0 || !email}
          variant="secondary"
          className="h-11 rounded-xl text-[14.5px] font-bold"
        >
          {resending
            ? "Sending…"
            : cooldown > 0
              ? `Resend email (${cooldown}s)`
              : "Resend email"}
        </Button>
        <Button
          variant="link"
          render={<Link href="/register" />}
          className="h-auto text-[13.5px] font-semibold"
        >
          Change email address
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already verified?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Log in
        </Link>
      </p>
    </div>
  );
}
