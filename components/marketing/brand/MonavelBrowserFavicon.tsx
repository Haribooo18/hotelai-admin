import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * Micro-mark for decorative browser-chrome tabs.
 * Symmetrical two-wing M for 10–14px; gold left, green right; no tile.
 */
export function MonavelBrowserFavicon({ className }: Props) {
  return (
    <svg
      className={cn("mkt-browser-favicon", className)}
      viewBox="0 0 16 16"
      width={14}
      height={14}
      fill="none"
      aria-hidden
      focusable="false"
    >
      <polygon points="2,2 6,2 8,6.5 8,9.5 6,14 2,14" fill="#C8A25A" />
      <polygon points="10,2 14,2 14,14 10,14 8,9.5 8,6.5" fill="#1F5B4C" />
    </svg>
  );
}
