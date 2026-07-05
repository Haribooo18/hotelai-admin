import {
  AdminPageStack,
  DashboardGlassPanel,
  DashboardSkeletonBlock,
} from "@/components/dashboard/home/DashboardPrimitives";

export function KnowledgeRouteLoading() {
  return (
    <AdminPageStack className="ds-page-enter">
      <div className="space-y-2">
        <DashboardSkeletonBlock className="h-8 w-48" />
        <DashboardSkeletonBlock className="h-4 w-72" />
      </div>

      <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-2 px-2 py-1">
              <DashboardSkeletonBlock className="h-3 w-20" />
              <DashboardSkeletonBlock className="h-7 w-14" />
            </div>
          ))}
        </div>
      </DashboardGlassPanel>

      <DashboardSkeletonBlock className="h-14 w-full" />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <DashboardSkeletonBlock key={index} className="h-52" />
        ))}
      </div>
    </AdminPageStack>
  );
}
