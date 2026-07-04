import { cn } from "@/lib/utils";

type Props = {
  guest: string;
  start: number;
  end: number;
  status?: string;
};

const statusStyles: Record<string, string> = {
  confirmed:
    "bg-emerald-600 hover:bg-emerald-500",

  checked_in:
    "bg-blue-600 hover:bg-blue-500",

  checked_out:
    "bg-zinc-600 hover:bg-zinc-500",

  cancelled:
    "bg-red-600 hover:bg-red-500",
};

export function CalendarBooking({
  guest,
  start,
  end,
  status = "confirmed",
}: Props) {
  const width = (end - start + 1) * 48;

  return (
    <div
      title={guest}
      className={cn(
        "absolute top-2 flex h-12 items-center rounded-lg px-3 text-sm font-medium text-white shadow transition-all",
        statusStyles[status] ??
          statusStyles.confirmed
      )}
      style={{
        left: `${220 + (start - 1) * 48}px`,
        width: `${width}px`,
      }}
    >
      {width >= 90 && (
        <span className="truncate">
          {guest}
        </span>
      )}
    </div>
  );
}