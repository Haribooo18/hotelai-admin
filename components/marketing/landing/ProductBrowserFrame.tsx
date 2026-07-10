import Image from "next/image";

import { HERO_CONTENT } from "@/lib/marketing/hero";

const ASPECT_RATIO = "16 / 10";

type Props = {
  className?: string;
};

export function ProductBrowserFrame({ className }: Props) {
  return (
    <div
      className={className}
      aria-hidden
      style={{ aspectRatio: ASPECT_RATIO }}
    >
      <div className="relative h-full overflow-hidden rounded-[var(--mkt-radius-2xl)] border border-[var(--mkt-border-strong)] bg-[var(--mkt-surface-2)] shadow-[var(--mkt-shadow-lg)]">
        <div className="flex h-10 items-center gap-3 border-b border-[var(--mkt-border-subtle)] bg-[var(--mkt-surface-glass)] px-4 backdrop-blur-md">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-[oklch(0.55_0.18_25)]" />
            <span className="size-2.5 rounded-full bg-[oklch(0.75_0.14_85)]" />
            <span className="size-2.5 rounded-full bg-[oklch(0.62_0.14_145)]" />
          </div>
          <div className="min-w-0 flex-1 rounded-md border border-[var(--mkt-border-subtle)] bg-[var(--mkt-surface-inset)] px-3 py-1">
            <p className="truncate font-mono text-xs text-[var(--mkt-text-subtle)]">
              {HERO_CONTENT.productUrl}
            </p>
          </div>
        </div>

        <div
          className="relative w-full bg-[var(--mkt-surface-inset)]"
          style={{ aspectRatio: ASPECT_RATIO }}
        >
          <Image
            src="/marketing/hero-ai-inbox.svg"
            alt=""
            width={1280}
            height={800}
            unoptimized
            priority
            className="absolute inset-0 h-full w-full object-cover object-left-top"
          />
        </div>
      </div>
    </div>
  );
}
