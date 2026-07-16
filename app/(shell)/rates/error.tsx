"use client";

import { RevenueError } from "@/components/dashboard/revenue/RevenueError";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RatesErrorRoute({ error, reset }: Props) {
  return (
    <RevenueError
      message={error.message || "Failed to load revenue analytics"}
      reset={reset}
    />
  );
}
