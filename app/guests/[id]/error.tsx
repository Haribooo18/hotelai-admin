"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GuestProfileError({
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <AlertTriangle className="h-10 w-10 text-red-400" />

      <h2 className="text-xl font-semibold">Failed to load profile</h2>

      <p className="max-w-md text-sm text-[var(--shell-muted)]">
        An error occurred while loading guest data.
      </p>

      <div className="flex gap-3">
        <Button onClick={reset}>Retry</Button>
        <Link
          href="/guests"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Back to guest list
        </Link>
      </div>
    </div>
  );
}
