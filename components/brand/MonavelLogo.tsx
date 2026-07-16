import { BRAND_ASSETS } from "@/lib/brand/assets";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** When true, hide from assistive tech (parent already names the brand). */
  decorative?: boolean;
};

/**
 * Official horizontal lockup — navbar, footer, docs, auth, product chrome.
 */
export function MonavelHorizontal({ className, decorative = false }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- official static SVG from /public/brand
    <img
      src={BRAND_ASSETS.horizontal}
      alt={decorative ? "" : "Monavel"}
      aria-hidden={decorative ? true : undefined}
      className={cn("mkt-logo-horizontal", className)}
      draggable={false}
    />
  );
}

/**
 * Official stacked lockup — large identity, presentations, Brand Book master.
 * Do not use in navigation chrome.
 */
export function MonavelLockup({ className, decorative = false }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- official static SVG from /public/brand
    <img
      src={BRAND_ASSETS.lockup}
      alt={decorative ? "" : "Monavel"}
      aria-hidden={decorative ? true : undefined}
      className={cn("mkt-logo-lockup", className)}
      draggable={false}
    />
  );
}

/**
 * Official Monavel mark — dashboard sidebar, compact UI, loading, chips.
 */
export function MonavelMark({ className, decorative = false }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- official static SVG from /public/brand
    <img
      src={BRAND_ASSETS.mark}
      alt={decorative ? "" : "Monavel"}
      aria-hidden={decorative ? true : undefined}
      className={cn("mkt-logo-mark", className)}
      draggable={false}
    />
  );
}

/**
 * Official wordmark — only when the symbol already exists separately.
 * Do not introduce new uses.
 */
export function MonavelWordmark({ className, decorative = false }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- official static SVG from /public/brand
    <img
      src={BRAND_ASSETS.wordmark}
      alt={decorative ? "" : "Monavel"}
      aria-hidden={decorative ? true : undefined}
      className={cn("mkt-logo-wordmark", className)}
      draggable={false}
    />
  );
}
