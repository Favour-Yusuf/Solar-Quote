import { PageHeaderSkeleton, ListRowsSkeleton } from "@/components/skeletons";

export default function QuotesLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <ListRowsSkeleton rows={6} />
    </div>
  );
}
