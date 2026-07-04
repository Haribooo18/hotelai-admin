"use client";

import { cn } from "@/lib/utils";

type Props = {
  status: string;
};

const styles: Record<string, string> = {
  confirmed:
    "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",

  checked_in:
    "bg-blue-500/15 text-blue-400 border border-blue-500/30",

  checked_out:
    "bg-zinc-500/15 text-zinc-300 border border-zinc-500/30",

  cancelled:
    "bg-red-500/15 text-red-400 border border-red-500/30",
};

const labels: Record<string, string> = {
  confirmed: "Подтверждено",
  checked_in: "Заселен",
  checked_out: "Выселен",
  cancelled: "Отменено",
};

export function BookingStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        styles[status] ??
          "bg-zinc-800 text-zinc-400"
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}