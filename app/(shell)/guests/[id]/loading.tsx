import { WorkspaceRouteSkeleton } from "@/components/dashboard/shared/WorkspaceRouteSkeleton";

export default function GuestProfileLoading() {
  return (
    <WorkspaceRouteSkeleton
      label="Loading guest profile"
      kpiCount={6}
      kpiGridClassName="sm:grid-cols-2 xl:grid-cols-6"
    />
  );
}
