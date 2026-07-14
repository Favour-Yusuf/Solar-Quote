"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { NAV_ITEMS } from "@/components/nav-items";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const [left, right] = [NAV_ITEMS.slice(0, 2), NAV_ITEMS.slice(2)];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-border bg-card px-1.5 pt-2 min-[901px]:hidden"
      style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
    >
      {left.map((item) => (
        <NavButton key={item.href} item={item} active={isActive(pathname, item.href)} />
      ))}

      <Link
        href="/quotes/new"
        aria-label="New Quote"
        className="-mt-3.5 flex flex-col items-center gap-0.5 px-3.5 py-1"
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-primary shadow-[0_6px_16px_oklch(52%_0.14_152_/_0.3)]">
          <Plus className="size-5 text-primary-foreground" strokeWidth={2.4} />
        </span>
      </Link>

      {right.map((item) => (
        <NavButton key={item.href} item={item} active={isActive(pathname, item.href)} />
      ))}
    </nav>
  );
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

function NavButton({
  item,
  active,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col items-center gap-0.5 px-3.5 py-2 text-muted-foreground",
        active && "text-primary"
      )}
    >
      <Icon className="size-5" strokeWidth={2} />
      <span className="text-[11px] font-semibold">{item.label}</span>
    </Link>
  );
}
