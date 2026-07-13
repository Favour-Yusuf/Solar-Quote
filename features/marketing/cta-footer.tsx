import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaFooter() {
  return (
    <>
      <section className="bg-primary px-6 py-[70px] text-center sm:px-12">
        <h2 className="font-heading text-[26px] font-extrabold text-primary-foreground sm:text-[30px]">
          Ready to quote in under a minute?
        </h2>
        <p className="mt-3.5 text-base text-primary-foreground/85">
          Free to start. No credit card required.
        </p>
        <Button
          variant="secondary"
          render={<Link href="/register" />}
          className="mt-7 h-auto rounded-[13px] px-[30px] py-4 text-[15.5px] font-extrabold text-accent-foreground"
        >
          Start Creating Quotes
        </Button>
      </section>
      <footer className="px-6 py-8 text-center text-[13px] text-muted-foreground sm:px-12">
        © 2026 SolarQuote. Built for installers, not enterprises.
      </footer>
    </>
  );
}
