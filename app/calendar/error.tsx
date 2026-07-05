"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/core/Button";
import { ErrorState } from "@/components/ui/feedback/ErrorState";

export default function CalendarError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <ErrorState
        title="Failed to load calendar"
        description="An error occurred while loading data. Try refreshing the page."
        action={
          <Button onClick={reset} className="bg-emerald-600 hover:bg-emerald-500">
            Retry
          </Button>
        }
        className="max-w-md"
      />
    </div>
  );
}
