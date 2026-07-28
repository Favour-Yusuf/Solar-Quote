"use client";

import type { Company } from "@prisma/client";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/actions/auth";
import { CompanySection } from "@/features/settings/company-section";
import { AccountSection } from "@/features/settings/account-section";
import { SecuritySection } from "@/features/settings/security-section";

export function SettingsView({
  company,
  userId,
  fullName,
  email,
}: {
  company: Company;
  userId: string;
  fullName: string;
  email: string;
}) {
  return (
    <div className="flex max-w-165 flex-col gap-5">
      <CompanySection company={company} userId={userId} />
      <AccountSection fullName={fullName} email={email} />
      <SecuritySection />

      <section className="rounded-2xl border border-border bg-card p-[22px]">
        <h2 className="mb-1 font-heading text-[17px] font-bold">Session</h2>
        <p className="mb-4 text-[13.5px] text-muted-foreground">
          Sign out of your account on this device.
        </p>
        <Button
          variant="outline"
          onClick={() => signOutAction()}
          className="h-11 w-fit gap-2 rounded-xl px-5 text-[14.5px] font-bold text-destructive hover:bg-destructive/10"
        >
          <LogOut className="size-4" strokeWidth={2.2} />
          Log out
        </Button>
      </section>
    </div>
  );
}
