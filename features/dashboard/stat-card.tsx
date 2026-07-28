import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: "revenue" | "paid";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border p-[22px] shadow-[0_1px_2px_oklch(20%_0.02_90_/_0.03)]",
        emphasis === "revenue"
          ? "border-transparent bg-primary shadow-[0_6px_20px_var(--brand-shadow)]"
          : "bg-card"
      )}
    >
      <div
        className={cn(
          "mb-2.5 text-[13.5px] font-semibold",
          emphasis === "revenue" ? "text-primary-foreground/80" : "text-muted-foreground"
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          "font-heading text-[30px] font-extrabold",
          emphasis === "revenue" && "text-primary-foreground",
          emphasis === "paid" && "text-primary"
        )}
      >
        {value}
      </div>
    </div>
  );
}
