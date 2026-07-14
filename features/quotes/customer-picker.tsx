"use client";

import type { Customer } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/utils/format";

export function CustomerPicker({
  selectedCustomer,
  search,
  onSearchChange,
  results,
  onSelect,
  onClear,
}: {
  selectedCustomer: Customer | null;
  search: string;
  onSearchChange: (v: string) => void;
  results: Customer[];
  onSelect: (customer: Customer) => void;
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-[22px]">
      <h2 className="mb-3.5 font-heading text-[15px] font-bold">1. Customer</h2>

      {selectedCustomer ? (
        <div className="flex items-center gap-3 rounded-xl bg-accent px-3.5 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-card font-heading text-[12.5px] font-bold text-accent-foreground">
            {getInitials(selectedCustomer.name)}
          </div>
          <div className="flex-1">
            <div className="text-[14.5px] font-bold">{selectedCustomer.name}</div>
            {selectedCustomer.businessName ? (
              <div className="text-[12.5px] text-muted-foreground">
                {selectedCustomer.businessName}
              </div>
            ) : null}
          </div>
          <Button
            variant="secondary"
            onClick={onClear}
            className="h-auto rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold"
          >
            Change
          </Button>
        </div>
      ) : (
        <div>
          <Input
            placeholder="Search customers by name or company…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 rounded-[11px] px-3.5 text-[14.5px]"
          />
          <div className="mt-2 max-h-[220px] overflow-auto rounded-xl">
            {results.length === 0 ? (
              <p className="px-3 py-2 text-[13px] text-muted-foreground">
                No customers found.
              </p>
            ) : (
              results.map((customer) => (
                <button
                  type="button"
                  key={customer.id}
                  onClick={() => onSelect(customer)}
                  className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left hover:bg-muted"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-muted font-heading text-[11.5px] font-bold text-muted-foreground">
                    {getInitials(customer.name)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{customer.name}</div>
                    {customer.businessName ? (
                      <div className="text-[12.5px] text-muted-foreground">
                        {customer.businessName}
                      </div>
                    ) : null}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
