import { Skeleton } from "@/components/ui/skeleton";

export default function EditPackageLoading() {
  return (
    <div>
      <Skeleton className="mb-2 h-8 w-40" />
      <Skeleton className="mb-6 h-4 w-64 max-w-full" />
      <div className="grid grid-cols-1 gap-5 min-[901px]:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-[20px]" />
      </div>
    </div>
  );
}
