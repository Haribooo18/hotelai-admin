"use client";

import { Button } from "@/components/ui/core/Button";
import { ErrorState } from "@/components/ui/feedback/ErrorState";

type Props = {
  message?: string;
  reset?: () => void;
};

export function SettingsError({
  message = "Failed to load settings",
  reset,
}: Props) {
  return (
    <ErrorState
      title={message}
      description="Check your connection and try again."
      action={
        reset ? (
          <Button variant="outline" size="sm" onClick={reset}>
            Retry
          </Button>
        ) : undefined
      }
    />
  );
}
