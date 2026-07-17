import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * Optically corrected Monavel mark for browser-mockup tabs (18×18).
 * Same three-panel architecture as public/brand/monavel-mark.svg —
 * wider panels, ~1px gaps, taller center, minimal viewBox padding.
 */
export function MonavelBrowserFavicon({ className }: Props) {
  return (
    <svg
      className={cn("mkt-browser-favicon", className)}
      viewBox="0 0 18 18"
      width={18}
      height={18}
      fill="none"
      aria-hidden
      focusable="false"
      shapeRendering="geometricPrecision"
    >
      {/* Gold left — mirrors green; shared bottom y=17.5 */}
      <polygon points="0.5,1.5 6,4.5 6,17.5 0.5,14.5" fill="#C8A25A" />
      {/* Graphite center — wider/taller so it holds at tab scale; 1-unit gaps */}
      <polygon points="7,4 11,5.5 11,17.5 7,16" fill="#2B2F35" />
      {/* Green right — symmetric to gold */}
      <polygon points="12,4.5 17.5,1.5 17.5,14.5 12,17.5" fill="#1F5B4C" />
    </svg>
  );
}
