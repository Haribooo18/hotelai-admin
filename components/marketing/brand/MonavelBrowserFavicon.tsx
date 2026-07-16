import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * Compact Monavel mark for decorative browser-chrome tabs.
 * Simplified panel geometry for 14px legibility; no dark tile background.
 */
export function MonavelBrowserFavicon({ className }: Props) {
  return (
    <svg
      className={cn("mkt-browser-favicon", className)}
      viewBox="0 0 32 32"
      width={14}
      height={14}
      fill="none"
      aria-hidden
      focusable="false"
    >
      <polygon points="3,5 12,11 12,28 3,22" fill="#C8A25A" />
      <polygon points="13.5,12 19.5,16 19.5,28 13.5,24" fill="#2B2F35" />
      <polygon points="21,11 29,5 29,22 21,28" fill="#1F5B4C" />
    </svg>
  );
}
