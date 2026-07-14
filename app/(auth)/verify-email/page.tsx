import type { Metadata } from "next";
import { MailCheck } from "lucide-react";
import { AuthSplitLayout } from "@/features/auth/auth-split-layout";
import { VerifyEmailView } from "@/features/auth/verify-email-view";

export const metadata: Metadata = { title: "Verify your email — SolarQuote" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string }>;
}) {
  const { email, error } = await searchParams;

  return (
    <AuthSplitLayout
      illustrationClassName="bg-foreground"
      illustration={
        <div className="flex max-w-[340px] flex-col items-center gap-4 text-center">
          <MailCheck className="size-12 text-primary" strokeWidth={1.6} />
          <p className="text-[15px] leading-relaxed text-background">
            Almost there — confirm your email to start creating branded quotes.
          </p>
        </div>
      }
    >
      <VerifyEmailView email={email ?? ""} confirmError={error === "1"} />
    </AuthSplitLayout>
  );
}
