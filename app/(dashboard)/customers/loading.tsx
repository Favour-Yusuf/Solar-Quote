import { PageHeaderSkeleton, CardsGridSkeleton } from "@/components/skeletons";

export default function CustomersLoading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <CardsGridSkeleton cards={6} />
    </div>
  );
}
