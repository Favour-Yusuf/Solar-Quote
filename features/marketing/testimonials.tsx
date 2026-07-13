const TESTIMONIALS = [
  {
    quote:
      "I used to spend an hour on every quote. Now I do it from the customer's driveway before I've even left.",
    name: "Marcus Webb",
    company: "Webb Retail Solar",
  },
  {
    quote:
      "Our quotes finally look like they came from a real company, not a Word template from 2012.",
    name: "Renee Álvarez",
    company: "Álvarez Solar Installs",
  },
  {
    quote:
      "WhatsApp sharing alone cut our response time in half. Customers just reply faster there.",
    name: "Leo Fontaine",
    company: "Fontaine Energy Co.",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-[1100px] px-6 py-20 sm:px-12">
      <h2 className="text-center font-heading text-[28px] font-extrabold tracking-tight sm:text-[32px]">
        Trusted by installers who used to dread quoting
      </h2>
      <div className="mt-12 grid grid-cols-1 gap-4 min-[901px]:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="rounded-[18px] border border-border bg-card p-6"
          >
            <p className="mb-4 text-[15px] leading-relaxed">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="text-[13.5px] font-bold">{t.name}</div>
            <div className="text-[12.5px] text-muted-foreground">
              {t.company}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
