import { Skeleton } from "@/components/ui/skeleton";

export function PageHeaderSkeleton() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-32 rounded-xl" />
    </div>
  );
}

export function StatsGridSkeleton() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 min-[561px]:grid-cols-2 min-[901px]:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-[22px]">
          <Skeleton className="mb-3 h-3.5 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

export function ListRowsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-border px-[22px] py-4 last:border-b-0"
        >
          <Skeleton className="size-[38px] shrink-0 rounded-[10px]" />
          <div className="flex-1">
            <Skeleton className="mb-1.5 h-3.5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function CardsGridSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 min-[561px]:grid-cols-2 min-[901px]:grid-cols-3">
      {Array.from({ length: cards }, (_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-[22px]">
          <div className="mb-3.5 flex items-center gap-3">
            <Skeleton className="size-[42px] shrink-0 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="mb-1.5 h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="mb-2 h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function DocumentSkeleton() {
  return (
    <div className="mx-auto max-w-225">
      <div className="mb-5 flex justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-64 rounded-xl" />
      </div>
      <div className="rounded-[22px] border border-border bg-card p-8 sm:p-12">
        <div className="mb-9 flex justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="mb-8 h-16 w-64" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    </div>
  );
}
