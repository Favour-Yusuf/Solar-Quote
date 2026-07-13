const STEPS = [
  {
    number: 1,
    title: "Add products",
    description:
      "Save your panels, inverters, batteries and labor rates once — reuse them forever.",
  },
  {
    number: 2,
    title: "Generate quote",
    description:
      "Pick a customer, add products, set a deposit — totals calculate live as you go.",
  },
  {
    number: 3,
    title: "Send to customer",
    description:
      "Download a polished PDF or share it straight to WhatsApp in one tap.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-[1100px] px-6 py-20 sm:px-12">
      <h2 className="text-center font-heading text-[28px] font-extrabold tracking-tight sm:text-[32px]">
        From job site to signed deal in 3 steps
      </h2>
      <p className="mt-3 text-center text-base text-muted-foreground">
        No training needed — if you can use WhatsApp, you can use SolarQuote.
      </p>
      <div className="mt-12 grid grid-cols-1 gap-5 min-[901px]:grid-cols-3">
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="rounded-[20px] border border-border bg-card p-7"
          >
            <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-success font-heading font-extrabold text-success-foreground">
              {step.number}
            </div>
            <div className="mb-2 text-[17px] font-bold">{step.title}</div>
            <div className="text-[14.5px] leading-relaxed text-muted-foreground">
              {step.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
