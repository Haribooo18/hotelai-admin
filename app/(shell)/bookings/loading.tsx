import { WorkspacePageSkeleton } from "@/components/dashboard/shared/skeleton";

export default function BookingsLoading() {
  return (
    <WorkspacePageSkeleton label="Loading reservations" variant="bookings" />
  );
}
