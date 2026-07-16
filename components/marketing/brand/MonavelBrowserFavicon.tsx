import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * Optically corrected small-size Monavel mark for browser-mockup tabs.
 * Same three-panel architecture as public/brand/monavel-mark.svg;
 * geometry nudged for 12–16px readability (no gradients/strokes/shadow).
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
      shapeRendering="geometricPrecision"
    >
      <polygon points="2,2.5 6,5.5 6,13.5 2,11" fill="#C8A25A" />
      <polygon points="6.5,6.5 9.5,8 9.5,13.5 6.5,11.5" fill="#2B2F35" />
      <polygon points="10,5.5 14,2.5 14,11 10,13.5" fill="#1F5B4C" />
    </svg>
  );
}
