import { BRAND_ASSETS } from "@/lib/brand/assets";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * Decorative browser-tab mark — official asset, unmodified geometry.
 */
export function MonavelBrowserFavicon({ className }: Props) {
  return (
    // Plain <img> avoids Next/Image layout + preload side effects.
    // eslint-disable-next-line @next/next/no-img-element -- decorative tab chrome; must stay a plain img
    <img
      src={BRAND_ASSETS.mark}
      alt=""
      aria-hidden="true"
      width={16}
      height={16}
      draggable={false}
      className={cn("mkt-browser-favicon", className)}
    />
  );
}
