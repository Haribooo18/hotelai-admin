import {
  AdminPageStack,
  DashboardGlassPanel,
  DashboardSkeletonBlock,
} from "@/components/dashboard/home/DashboardPrimitives";
import { RoutePageHeaderSkeleton } from "@/components/dashboard/shared/RoutePageHeaderSkeleton";

export function SettingsRouteLoading() {
  return (
    <AdminPageStack className="ds-page-enter">
      <RoutePageHeaderSkeleton />

      <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="space-y-2 px-2 py-1">
              <DashboardSkeletonBlock className="h-3 w-20" />
              <DashboardSkeletonBlock className="h-7 w-14" />
            </div>
          ))}
        </div>
      </DashboardGlassPanel>

      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <DashboardSkeletonBlock className="h-80" />
        <div className="space-y-4">
          <DashboardSkeletonBlock className="h-64" />
          <DashboardSkeletonBlock className="h-48" />
        </div>
      </div>
    </AdminPageStack>
  );
}
