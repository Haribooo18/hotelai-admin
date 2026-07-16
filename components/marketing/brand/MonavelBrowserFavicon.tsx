import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * Dedicated 14px browser-tab micro-mark.
 * Two mirrored wings forming one balanced M — gold left, green right.
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
      {/* Mirrored wings; shared center edge keeps the notch gapless */}
      <polygon
        points="1.5,2.5 6.5,2.5 8,7.5 8,10.5 6.5,13.5 1.5,13.5"
        fill="#C8A25A"
      />
      <polygon
        points="9.5,2.5 14.5,2.5 14.5,13.5 9.5,13.5 8,10.5 8,7.5"
        fill="#1F5B4C"
      />
    </svg>
  );
}
