import { cn } from "@/lib/utils";

export type QuoteStatusValue = "DRAFT" | "SENT" | "PAID";

const STATUS_META: Record<
  QuoteStatusValue,
  { label: string; className: string }
> = {
  DRAFT: { label: "Draft", className: "bg-muted text-muted-foreground" },
  SENT: { label: "Sent", className: "bg-warning text-warning-foreground" },
  PAID: { label: "Paid", className: "bg-success text-success-foreground" },
};

export function StatusPill({
  status,
  className,
}: {
  status: QuoteStatusValue;
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex min-w-[60px] items-center justify-center rounded-full px-3 py-1 text-xs font-bold",
        meta.className,
        className
      )}
    >
      {meta.label}
    </span>
  );
}
