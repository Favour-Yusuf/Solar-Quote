import type { Metadata } from "next";
import { AuthSplitLayout } from "@/features/auth/auth-split-layout";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = { title: "Log in — SolarQuote" };

export default function LoginPage() {
  return (
    <AuthSplitLayout
      illustrationClassName="bg-accent"
      illustration={
        <div className="max-w-[360px]">
          <p className="font-heading text-[22px] font-extrabold leading-snug text-accent-foreground">
            &ldquo;I do it from the customer&apos;s driveway before I&apos;ve even
            left.&rdquo;
          </p>
          <p className="mt-3.5 text-sm font-semibold text-accent-foreground/80">
            Marcus Webb, Webb Retail Solar
          </p>
        </div>
      }
    >
      <LoginForm />
    </AuthSplitLayout>
  );
}
