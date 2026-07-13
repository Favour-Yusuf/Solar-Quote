"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { NAV_ITEMS } from "@/components/nav-items";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/format";

export function AppSidebar({
  userName,
  companyName,
}: {
  userName: string;
  companyName: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-0.5 border-r border-border bg-card px-4 py-7 min-[901px]:flex">
      <Link href="/dashboard" className="mb-7 flex items-center gap-2.5 px-2.5">
        <Logo size={34} />
        <span className="font-heading text-lg font-extrabold tracking-tight">
          SolarQuote
        </span>
      </Link>

      <Button
        render={<Link href="/quotes/new" />}
        className="mb-5 h-auto justify-center gap-2 rounded-xl py-3 font-heading text-[14.5px] font-bold shadow-[0_1px_2px_rgba(0,0,0,0.06),0_6px_16px_oklch(52%_0.14_152_/_0.22)]"
      >
        <Plus className="size-4" strokeWidth={2.4} />
        New Quote
      </Button>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14.5px] font-semibold transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground/80 hover:bg-muted"
              )}
            >
              <Icon
                className="size-[18px]"
                strokeWidth={2}
                color={active ? "currentColor" : undefined}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-2.5 border-t border-border px-2.5 pt-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-terracotta font-heading text-[13px] font-bold text-terracotta-foreground">
          {getInitials(userName)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[13.5px] font-semibold leading-tight">
            {userName}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {companyName}
          </div>
        </div>
      </div>
    </aside>
  );
}
