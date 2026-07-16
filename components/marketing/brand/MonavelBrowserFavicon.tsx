import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * Dedicated browser-tab monogram — a single geometric M for small UI chrome.
 * Not a substitute for the official full-size brand mark.
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
      <path
        fill="#C8A25A"
        d="M2 2.5h3L8 7.5 11 2.5h3V13.5h-3V7L8 10.5 5 7v6.5H2V2.5Z"
      />
    </svg>
  );
}
