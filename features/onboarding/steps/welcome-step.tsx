import { Button } from "@/components/ui/button";
import { OnboardingCard } from "@/features/onboarding/onboarding-shell";

const TASKS = [
  "Add your company details",
  "Add a few products",
  "Add where you get paid",
];

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <OnboardingCard className="text-center">
      <div className="mb-4 text-4xl">👋</div>
      <h1 className="font-heading text-2xl font-extrabold">
        Welcome to SolarQuote
      </h1>
      <p className="mx-auto mt-2.5 mb-7 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
        Let&apos;s get you set up in a few minutes so you can send your first
        professional quote today.
      </p>
      <div className="mb-7 flex flex-col gap-3 text-left">
        {TASKS.map((task, i) => (
          <div
            key={task}
            className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3 text-sm font-semibold"
          >
            <span className="text-primary">{i + 1}</span>
            {task}
          </div>
        ))}
      </div>
      <Button onClick={onNext} className="h-12 w-full rounded-xl text-[15px] font-bold">
        Let&apos;s get started
      </Button>
    </OnboardingCard>
  );
}
