import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-6 py-14 text-center",
        className
      )}
    >
      {Icon ? (
        <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="size-5" />
        </div>
      ) : null}
      <div className="font-heading text-[15px] font-bold">{title}</div>
      {description ? (
        <div className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          {description}
        </div>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
