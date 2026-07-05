import { DashboardSkeletonBlock } from "@/components/dashboard/home/DashboardPrimitives";

export function RoutePageHeaderSkeleton() {
  return (
    <div className="space-y-2">
      <DashboardSkeletonBlock className="h-8 w-48" />
      <DashboardSkeletonBlock className="h-4 w-72" />
    </div>
  );
}
