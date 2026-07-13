import { MarketingHeader } from "@/features/marketing/marketing-header";
import { Hero } from "@/features/marketing/hero";
import { PainPoints } from "@/features/marketing/pain-points";
import { HowItWorks } from "@/features/marketing/how-it-works";
import { FeaturesGrid } from "@/features/marketing/features-grid";
import { Testimonials } from "@/features/marketing/testimonials";
import { CtaFooter } from "@/features/marketing/cta-footer";

export default function Home() {
  return (
    <div className="flex-1">
      <MarketingHeader />
      <Hero />
      <PainPoints />
      <HowItWorks />
      <FeaturesGrid />
      <Testimonials />
      <CtaFooter />
    </div>
  );
}
