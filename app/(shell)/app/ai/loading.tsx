import { Skeleton } from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { WorkspaceRouteSkeleton } from "@/components/dashboard/shared/WorkspaceRouteSkeleton";

export default function AppAiLoading() {
  return (
    <WorkspaceRouteSkeleton
      label="Loading AI inbox"
      kpiCount={6}
      kpiGridClassName="sm:grid-cols-2 xl:grid-cols-6"
    >
      <Skeleton className="h-28 rounded-[var(--ds-radius)]" />
      <GlassSurface className="p-[var(--ds-surface-padding)]">
        <Skeleton className="min-h-[520px] rounded-[var(--ds-radius)]" />
      </GlassSurface>
    </WorkspaceRouteSkeleton>
  );
}
