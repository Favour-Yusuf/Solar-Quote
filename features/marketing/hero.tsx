import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-10 pt-14 text-center sm:px-12 sm:pt-16">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-terracotta px-3.5 py-1.5 text-[13px] font-bold text-terracotta-foreground">
        ☀ Built for solar installers
      </div>
      <h1 className="mx-auto max-w-3xl font-heading text-[34px] font-extrabold leading-[1.1] tracking-tight sm:text-[44px] md:text-[56px] md:leading-[1.08]">
        Create solar quotes in seconds. Close more deals.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-muted-foreground sm:text-lg">
        Stop wrestling with Word docs and Excel sheets. Build branded,
        professional quotations and send them straight to WhatsApp — in
        under a minute.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
        <Button
          render={<Link href="/register" />}
          className="h-auto rounded-[13px] px-[26px] py-[15px] text-[15.5px] font-bold shadow-[0_8px_22px_oklch(52%_0.14_152_/_0.25)]"
        >
          Start Creating Quotes
        </Button>
        <Button
          variant="outline"
          render={<Link href="#how-it-works" />}
          className="h-auto rounded-[13px] px-[26px] py-[15px] text-[15.5px] font-bold"
        >
          See How It Works
        </Button>
      </div>

      <div className="mx-auto mt-16 max-w-[1000px]">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-[0_30px_70px_oklch(20%_0.02_90_/_0.1)]">
          <div
            className="flex aspect-video w-full items-center justify-center rounded-2xl font-mono text-[13px] text-success-foreground"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, oklch(96% 0.02 152) 0px, oklch(96% 0.02 152) 14px, oklch(93% 0.03 152) 14px, oklch(93% 0.03 152) 28px)",
            }}
          >
            product preview — quote wizard screenshot
          </div>
        </div>
      </div>
    </section>
  );
}
