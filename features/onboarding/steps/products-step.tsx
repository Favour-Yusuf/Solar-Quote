"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingCard } from "@/features/onboarding/onboarding-shell";
import { STARTER_PRODUCTS } from "@/features/onboarding/constants";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";

export function ProductsStep({
  selectedKeys,
  onToggle,
  onBack,
  onNext,
}: {
  selectedKeys: Set<string>;
  onToggle: (key: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <OnboardingCard>
      <h1 className="font-heading text-[21px] font-extrabold">
        Add your products
      </h1>
      <p className="mt-2 mb-5.5 text-sm leading-relaxed text-muted-foreground">
        Tap to add — you can edit prices anytime from your catalogue.
      </p>

      <div className="flex flex-col gap-2.5">
        {STARTER_PRODUCTS.map((product) => {
          const added = selectedKeys.has(product.key);
          return (
            <button
              type="button"
              key={product.key}
              onClick={() => onToggle(product.key)}
              className={cn(
                "flex items-center gap-3.5 rounded-[13px] border-[1.5px] px-4 py-3.5 text-left transition-colors",
                added ? "border-primary bg-accent" : "border-border bg-transparent"
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-[7px] border-[1.5px]",
                  added ? "border-primary bg-primary" : "border-border bg-transparent"
                )}
              >
                {added ? <Check className="size-3.5 text-primary-foreground" strokeWidth={3} /> : null}
              </span>
              <span className="flex-1">
                <span className="block text-[14.5px] font-bold">{product.name}</span>
                <span className="block text-[12.5px] text-muted-foreground">
                  Default price: {formatCurrency(product.priceCents)}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex gap-2.5">
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
