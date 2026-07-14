import Link from "next/link";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { getInitials } from "@/utils/format";

type CustomerWithCount = {
  id: string;
  name: string;
  businessName: string | null;
  phone: string | null;
  email: string | null;
  _count: { quotes: number };
};

export function CustomersGrid({ customers }: { customers: CustomerWithCount[] }) {
  if (customers.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No customers yet"
        description="Add your first customer to start creating quotes for them."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 min-[561px]:grid-cols-2 min-[901px]:grid-cols-3">
      {customers.map((customer) => (
        <Link
          key={customer.id}
          href={`/customers/${customer.id}`}
          className="rounded-2xl border border-border bg-card p-[22px] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_oklch(20%_0.02_90_/_0.08)]"
        >
          <div className="mb-3.5 flex items-center gap-3">
            <div className="flex size-[42px] shrink-0 items-center justify-center rounded-xl bg-accent font-heading text-sm font-bold text-accent-foreground">
              {getInitials(customer.name)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[15.5px] font-bold">{customer.name}</div>
              {customer.businessName ? (
                <div className="truncate text-[13px] text-muted-foreground">
                  {customer.businessName}
                </div>
              ) : null}
            </div>
          </div>
          {customer.phone ? (
            <div className="mb-1 truncate text-[13.5px] text-muted-foreground">
              {customer.phone}
            </div>
          ) : null}
          {customer.email ? (
            <div className="mb-3.5 truncate text-[13.5px] text-muted-foreground">
              {customer.email}
            </div>
          ) : null}
          <div className="flex justify-between border-t border-border pt-3 text-[13px]">
            <span className="text-muted-foreground">Quotes</span>
            <span className="font-bold">{customer._count.quotes}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
