"use client";

import { RouteErrorFallback } from "@/components/dashboard/shared/RouteErrorFallback";

export default function AIError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorFallback error={error} reset={reset} titleKey="errors.loadAi" />
  );
}
