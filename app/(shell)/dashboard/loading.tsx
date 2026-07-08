import { WorkspaceRouteSkeleton } from "@/components/dashboard/shared/WorkspaceRouteSkeleton";

export default function DashboardLoading() {
  return (
    <WorkspaceRouteSkeleton
      label="Loading dashboard"
      kpiCount={6}
      kpiGridClassName="sm:grid-cols-2 xl:grid-cols-6"
    />
  );
}
