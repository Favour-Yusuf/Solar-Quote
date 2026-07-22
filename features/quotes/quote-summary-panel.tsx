"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { FieldError } from "@/components/field-error";
import { formatCurrency, formatLongDate } from "@/utils/format";
import { CURRENCY_OPTIONS } from "@/lib/currency";
import { VALIDITY_DAY_OPTIONS } from "@/lib/validations/settings";

const selectClass =
  "h-11 w-full rounded-[11px] border border-input bg-transparent px-3.5 text-[14.5px] outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function QuoteBuilderExtras({
  currency,
  onCurrencyChange,
  validityMode,
  onValidityModeChange,
  customValidUntil,
  onCustomValidUntilChange,
  validUntil,
  depositPercent,
  onDepositChange,
  notes,
  onNotesChange,
}: {
  currency: string;
  onCurrencyChange: (v: string) => void;
  validityMode: string;
  onValidityModeChange: (v: string) => void;
  customValidUntil: string;
  onCustomValidUntilChange: (v: string) => void;
  validUntil: Date | null;
  depositPercent: number;
  onDepositChange: (v: number) => void;
  notes: string;
  onNotesChange: (v: string) => void;
}) {
  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-[22px]">
        <h2 className="mb-3.5 font-heading text-[15px] font-bold">3. Currency &amp; Validity</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="quote-currency" className="mb-1.5 block text-[13px] font-semibold">
              Currency
            </label>
            <select
              id="quote-currency"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className={selectClass}
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="quote-validity" className="mb-1.5 block text-[13px] font-semibold">
              Valid for
            </label>
            <select
              id="quote-validity"
              value={validityMode}
              onChange={(e) => onValidityModeChange(e.target.value)}
              className={selectClass}
            >
              {VALIDITY_DAY_OPTIONS.map((days) => (
                <option key={days} value={String(days)}>
                  {days} days
                </option>
              ))}
              <option value="custom">Custom date…</option>
            </select>
          </div>
        </div>

        {validityMode === "custom" ? (
          <div className="mt-3">
            <label htmlFor="quote-valid-until" className="mb-1.5 block text-[13px] font-semibold">
              Expiry date
            </label>
            <input
              id="quote-valid-until"
              type="date"
              value={customValidUntil}
              onChange={(e) => onCustomValidUntilChange(e.target.value)}
              className={selectClass}
            />
          </div>
        ) : null}

        {validUntil ? (
          <p className="mt-3 text-[12.5px] text-muted-foreground">
            Quote valid until <span className="font-semibold text-foreground">{formatLongDate(validUntil)}</span>
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-border bg-card p-[22px]">
        <h2 className="mb-4 font-heading text-[15px] font-bold">4. Deposit</h2>
        <div className="mb-1.5 flex items-center gap-4">
          <Slider
            value={[depositPercent]}
            onValueChange={(v) => onDepositChange(Array.isArray(v) ? v[0] : v)}
            min={0}
            max={100}
            step={5}
            className="flex-1"
          />
          <div className="w-16 text-right font-heading text-xl font-extrabold text-primary">
            {depositPercent}%
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-[22px]">
        <h2 className="mb-3.5 font-heading text-[15px] font-bold">
          5. Notes <span className="text-[13px] font-normal text-muted-foreground">(optional)</span>
        </h2>
        <Textarea
          placeholder="e.g. Includes 25-year panel warranty and 10-year workmanship guarantee."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="min-h-20 rounded-[11px] px-3.5 py-3 text-sm"
        />
      </div>
    </>
  );
}

export function QuoteSummaryPanel({
  subtotalCents,
  depositCents,
  depositPercent,
  currency,
  itemCount,
  canGenerate,
  submitting,
  error,
  onGenerate,
}: {
  subtotalCents: number;
  depositCents: number;
  depositPercent: number;
  currency: string;
  itemCount: number;
  canGenerate: boolean;
  submitting: boolean;
  error: string | null;
  onGenerate: () => void;
}) {
  const balanceCents = subtotalCents - depositCents;

  return (
    <div className="h-fit rounded-[20px] bg-foreground p-[26px] text-background min-[901px]:sticky min-[901px]:top-8">
      <h2 className="mb-4.5 font-heading text-[15px] font-bold opacity-85">Summary</h2>
      <div className="mb-2.5 flex justify-between text-sm opacity-75">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotalCents, currency)}</span>
      </div>
      <div className="mb-4 flex justify-between text-sm opacity-75">
        <span>Items</span>
        <span>{itemCount}</span>
      </div>
      <div className="mb-4 h-px bg-background/10" />
      <div className="mb-1.5 flex justify-between font-heading text-[26px] font-extrabold">
        <span>Total</span>
        <span>{formatCurrency(subtotalCents, currency)}</span>
      </div>
      <div className="flex justify-between text-[13.5px] opacity-75">
        <span>Deposit ({depositPercent}%)</span>
        <span>{formatCurrency(depositCents, currency)}</span>
      </div>
      <div className="mb-5.5 flex justify-between text-[13.5px] opacity-75">
        <span>Balance</span>
        <span>{formatCurrency(balanceCents, currency)}</span>
      </div>

      <FieldError message={error ?? undefined} />

      <Button
        onClick={onGenerate}
        disabled={!canGenerate}
        className="h-[52px] w-full gap-2 rounded-[13px] bg-[oklch(60%_0.15_145)] text-[15.5px] font-bold text-white hover:bg-[oklch(55%_0.15_145)] disabled:opacity-50"
      >
        <Check className="size-4" strokeWidth={2.4} />
        {submitting ? "Generating…" : "Generate Quote"}
      </Button>
      <p className="mt-3 text-center text-xs opacity-55">
        Fill in a customer and at least one product to continue
      </p>
    </div>
  );
}
