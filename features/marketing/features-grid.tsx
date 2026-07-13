const FEATURES = [
  {
    emoji: "🎨",
    title: "Branded quotes",
    description: "Your logo and colors on every document, automatically.",
  },
  {
    emoji: "📦",
    title: "Product catalogue",
    description: "Save your panels, inverters and pricing once, use forever.",
  },
  {
    emoji: "👥",
    title: "Customer management",
    description: "Every customer and their quote history, in one place.",
  },
  {
    emoji: "📑",
    title: "PDF export",
    description: "Clean, print-ready quotes your customers take seriously.",
  },
  {
    emoji: "💬",
    title: "WhatsApp sharing",
    description: "Send quotes where your customers actually reply.",
  },
  {
    emoji: "🏦",
    title: "Payment details",
    description: "Bank details and deposit terms built into every quote.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="bg-muted px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="text-center font-heading text-[28px] font-extrabold tracking-tight sm:text-[32px]">
          Everything you need, nothing you don&apos;t
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-4 min-[561px]:grid-cols-2 min-[901px]:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-[18px] bg-card p-6">
              <div className="mb-2.5 text-[22px]">{feature.emoji}</div>
              <div className="mb-1.5 text-[15.5px] font-bold">
                {feature.title}
              </div>
              <div className="text-[13.5px] leading-relaxed text-muted-foreground">
                {feature.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
