import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * Browser-tab micro-mark derived from public/brand/monavel-mark.svg.
 * Three architectural panels, simplified for 10–14px (no tile, strokes, or gradients).
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
      <polygon points="2,2.5 6,5.5 6,13.5 2,11" fill="#C8A25A" />
      <polygon points="6,6.5 9.5,8 9.5,13.5 6,11.5" fill="#2B2F35" />
      <polygon points="9.5,5.5 14,2.5 14,11 9.5,13.5" fill="#1F5B4C" />
    </svg>
  );
}
