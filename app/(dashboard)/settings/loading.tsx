import { PageHeaderSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <div className="flex max-w-165 flex-col gap-5">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-[22px]">
            <Skeleton className="mb-4 h-5 w-32" />
            <Skeleton className="mb-3 h-11 w-full rounded-[11px]" />
            <Skeleton className="h-11 w-full rounded-[11px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
