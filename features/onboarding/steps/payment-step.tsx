"use client";

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OnboardingCard } from "@/features/onboarding/onboarding-shell";

export function PaymentStep({
  bankName,
  onBankNameChange,
  accountName,
  onAccountNameChange,
  accountNumber,
  onAccountNumberChange,
  onBack,
  onNext,
}: {
  bankName: string;
  onBankNameChange: (v: string) => void;
  accountName: string;
  onAccountNameChange: (v: string) => void;
  accountNumber: string;
  onAccountNumberChange: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <OnboardingCard>
      <h1 className="font-heading text-[21px] font-extrabold">
        Where do you get paid?
      </h1>
      <p className="mt-2 mb-5.5 text-sm leading-relaxed text-muted-foreground">
        These details appear on every quote so customers can pay you directly.
      </p>

      <div className="mb-4.5 flex flex-col gap-3">
        <Input
          placeholder="Bank name"
          value={bankName}
          onChange={(e) => onBankNameChange(e.target.value)}
          className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
        />
        <Input
          placeholder="Account holder name"
          value={accountName}
          onChange={(e) => onAccountNameChange(e.target.value)}
          className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
        />
        <Input
          placeholder="Account number"
          value={accountNumber}
          onChange={(e) => onAccountNumberChange(e.target.value)}
          className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
        />
      </div>

      <div className="flex gap-2.5 rounded-xl bg-terracotta px-4 py-3.5">
        <Lock className="mt-0.5 size-4 shrink-0 text-terracotta-foreground" strokeWidth={2.4} />
        <p className="text-[13px] leading-relaxed text-terracotta-foreground">
          Your customers pay you directly. SolarQuote never holds your money.
        </p>
      </div>

      <div className="mt-5 flex gap-2.5">
        <Button
          variant="secondary"
          onClick={onBack}
          className="h-11 rounded-xl px-5 text-[14.5px] font-bold"
        >
          Back
        </Button>
        <Button onClick={onNext} className="h-11 flex-1 rounded-xl text-[15px] font-bold">
          Continue
        </Button>
      </div>
    </OnboardingCard>
  );
}
