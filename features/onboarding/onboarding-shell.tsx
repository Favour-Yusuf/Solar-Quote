import type { ReactNode } from "react";
import { LogoMark } from "@/components/logo";
import { cn } from "@/lib/utils";

export function OnboardingShell({
  step,
  totalSteps,
  showProgress,
  children,
}: {
  step: number;
  totalSteps: number;
  showProgress: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center px-6 pb-16 pt-10">
      <LogoMark />

      {showProgress ? (
        <div className="mb-2 mt-6 flex items-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i < step ? "w-8 bg-primary" : "w-4 bg-muted"
              )}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6" />
      )}

      <div className="w-full max-w-[520px]">{children}</div>
    </div>
  );
}

export function OnboardingCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[22px] border border-border bg-card p-9",
        className
      )}
    >
      {children}
    </div>
  );
}
