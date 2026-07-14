import { Skeleton } from "@/components/ui/skeleton";

export default function OnboardingLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center px-6 pb-16 pt-10">
      <Skeleton className="h-8 w-32" />
      <div className="mt-6 w-full max-w-[520px]">
        <Skeleton className="h-96 rounded-[22px]" />
      </div>
    </div>
  );
}
