import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-baseline justify-between gap-3",
        className
      )}
    >
      <div>
        <h1 className="font-heading text-[26px] font-extrabold tracking-tight sm:text-[28px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-[15px] text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
