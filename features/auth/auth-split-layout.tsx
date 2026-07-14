import type { ReactNode } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { cn } from "@/lib/utils";

export function AuthSplitLayout({
  children,
  illustration,
  illustrationClassName,
}: {
  children: ReactNode;
  illustration: ReactNode;
  illustrationClassName?: string;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 min-[901px]:grid-cols-2">
      <div className="flex items-center justify-center p-12">
        <div className="w-full max-w-[380px]">
          <Link href="/" className="mb-10 inline-block">
            <LogoMark />
          </Link>
          {children}
        </div>
      </div>
      <div
        className={cn(
          "order-first flex items-center justify-center p-12 min-[901px]:order-none",
          illustrationClassName
        )}
      >
        {illustration}
      </div>
    </div>
  );
}
