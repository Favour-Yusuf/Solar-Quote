"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/field-error";
import { OnboardingCard } from "@/features/onboarding/onboarding-shell";

export function DoneStep({
  onFinish,
  submitting,
  error,
}: {
  onFinish: () => void;
  submitting: boolean;
  error: string | null;
}) {
  return (
    <OnboardingCard className="text-center">
      <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-success">
        <Check className="size-[30px] text-success-foreground" strokeWidth={2.6} />
      </div>
      <h1 className="font-heading text-2xl font-extrabold">You&apos;re all set!</h1>
      <p className="mx-auto mt-2.5 mb-7 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
        You&apos;re ready to create your first professional solar quote.
      </p>
      <FieldError message={error ?? undefined} />
      <Button
        onClick={onFinish}
        disabled={submitting}
        className="mt-2 h-[52px] w-full rounded-xl text-[15.5px] font-bold"
      >
        {submitting ? "Setting up…" : "Create First Quote"}
      </Button>
    </OnboardingCard>
  );
}
