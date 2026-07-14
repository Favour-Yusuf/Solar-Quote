import { PageHeaderSkeleton, StatsGridSkeleton, ListRowsSkeleton } from "@/components/skeletons";

export default function DashboardLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <StatsGridSkeleton />
      <ListRowsSkeleton rows={4} />
    </div>
  );
}
