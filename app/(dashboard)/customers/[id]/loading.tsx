import { Skeleton } from "@/components/ui/skeleton";
import { ListRowsSkeleton } from "@/components/skeletons";

export default function CustomerDetailLoading() {
  return (
    <div className="max-w-190">
      <Skeleton className="mb-4.5 h-4 w-32" />
      <div className="mb-6.5 flex items-center gap-4">
        <Skeleton className="size-14 rounded-2xl" />
        <div>
          <Skeleton className="mb-1.5 h-6 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <div className="mb-7 grid grid-cols-1 gap-3 min-[561px]:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-16 rounded-[14px]" />
        ))}
      </div>
      <Skeleton className="mb-3 h-4 w-28" />
      <ListRowsSkeleton rows={2} />
    </div>
  );
}
