import type { Metadata } from "next";
import { Check } from "lucide-react";
import { AuthSplitLayout } from "@/features/auth/auth-split-layout";
import { RegisterForm } from "@/features/auth/register-form";

export const metadata: Metadata = { title: "Create your account — SolarQuote" };

const CHECKLIST = [
  "Setup takes about 3 minutes",
  "No credit card required to start",
  "Your first quote in under a minute",
  "Customers pay you directly — always",
];

export default function RegisterPage() {
  return (
    <AuthSplitLayout
      illustrationClassName="bg-foreground"
      illustration={
        <div className="flex max-w-[340px] flex-col gap-5">
          {CHECKLIST.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <Check className="mt-0.5 size-[18px] shrink-0 text-primary" strokeWidth={2.6} />
              <span className="text-[15px] leading-relaxed text-background">
                {item}
              </span>
            </div>
          ))}
        </div>
      }
    >
      <RegisterForm />
    </AuthSplitLayout>
  );
}
