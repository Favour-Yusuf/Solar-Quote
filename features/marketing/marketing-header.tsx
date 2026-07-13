import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/logo";

export function MarketingHeader() {
  return (
    <header className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-5 sm:px-12">
      <Link href="/">
        <LogoMark />
      </Link>
      <div className="flex items-center gap-5">
        <Button
          variant="ghost"
          render={<Link href="/login" />}
          className="h-auto px-2 py-1 text-[14.5px] font-semibold"
        >
          Log in
        </Button>
        <Button
          render={<Link href="/register" />}
          className="h-auto rounded-[11px] px-[18px] py-[11px] text-[14.5px] font-bold"
        >
          Get Started
        </Button>
      </div>
    </header>
  );
}
