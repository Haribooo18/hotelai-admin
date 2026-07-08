"use client";

import { RouteErrorFallback } from "@/components/dashboard/shared/RouteErrorFallback";

export default function RoomsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorFallback error={error} reset={reset} titleKey="errors.loadRooms" />
  );
}
