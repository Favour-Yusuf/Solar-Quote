const PAIN_POINTS = [
  {
    emoji: "📄",
    title: "Manual quotes",
    description:
      "Copy-pasting the same Word template for every customer, every time.",
  },
  {
    emoji: "🐢",
    title: "Slow follow-ups",
    description:
      "Customers wait days for a quote — and go with whoever replies first.",
  },
  {
    emoji: "📉",
    title: "Unprofessional docs",
    description:
      "No branding, inconsistent formatting — it costs you trust before you even meet.",
  },
  {
    emoji: "💸",
    title: "Chasing payments",
    description:
      "No clear deposit terms, so payment conversations drag on for weeks.",
  },
];

export function PainPoints() {
  return (
    <section className="bg-foreground px-6 py-[72px] sm:px-12">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="text-center font-heading text-[28px] font-extrabold text-background sm:text-[32px]">
          Sound familiar?
        </h2>
        <p className="mt-3 text-center text-base text-background/70">
          Most installers are still quoting like it&apos;s 2010.
        </p>
        <div className="mt-11 grid grid-cols-1 gap-4 min-[561px]:grid-cols-2 min-[901px]:grid-cols-4">
          {PAIN_POINTS.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl bg-[oklch(26%_0.02_90)] p-[22px]"
            >
              <div className="mb-2.5 text-[22px]">{point.emoji}</div>
              <div className="mb-1.5 text-[15px] font-bold text-background">
                {point.title}
              </div>
              <div className="text-[13.5px] leading-relaxed text-background/65">
                {point.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
