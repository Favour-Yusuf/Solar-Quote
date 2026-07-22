import { PageHeaderSkeleton, CardsGridSkeleton } from "@/components/skeletons";

export default function PackagesLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <CardsGridSkeleton cards={6} />
    </div>
  );
}
