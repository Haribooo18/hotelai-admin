"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function MockupPanel({
  children,
  className,
  active = false,
}: {
  children: ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <section
      className={cn(
        "mku-panel rounded-[16px] border bg-white/[0.022]",
        "transition-[border-color,background-color,box-shadow,transform] duration-500",
        active
          ? "mku-panel-active border-[#d8b66f]/20 bg-[#d8b66f]/[0.04] shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
          : "border-white/[0.06]",
        className
      )}
    >
      {children}
    </section>
  );
}

export function MockupSectionHeader({
  eyebrow,
  title,
  trailing,
}: {
  eyebrow?: string;
  title: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#656d76]">
            {eyebrow}
          </p>
        ) : null}

        <h3 className="mt-1 text-[12px] font-semibold tracking-[-0.02em] text-[#e5e2da]">
          {title}
        </h3>
      </div>

      {trailing}
    </div>
  );
}

export function MockupSparkline({
  points,
  tone = "neutral",
}: {
  points: string;
  tone?: "gold" | "green" | "neutral";
}) {
  const toneClass =
    tone === "gold"
      ? "text-[#d8b66f]"
      : tone === "green"
        ? "text-[#7eae99]"
        : "text-[#8b939c]";

  return (
    <svg
      viewBox="0 0 96 28"
      className={cn("mt-3 h-6 w-full overflow-visible", toneClass)}
      aria-hidden
    >
      <path
        d={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-85"
      />
    </svg>
  );
}

export function MockupMetric({
  label,
  value,
  delta,
  icon: Icon,
  tone = "neutral",
  active = false,
  sparkline,
  motionKey,
}: {
  label: string;
  value: string;
  delta: string;
  icon?: LucideIcon;
  tone?: "gold" | "green" | "neutral";
  active?: boolean;
  sparkline?: string;
  motionKey?: string | number;
}) {
  const toneClass =
    tone === "gold"
      ? "text-[#d8b66f]"
      : tone === "green"
        ? "text-[#7eae99]"
        : "text-[#ece9e2]";

  return (
    <MockupPanel active={active} className="p-4">
      <div
        key={motionKey}
        className="mku-runtime-swap flex items-start justify-between gap-3"
      >
        <div className="min-w-0">
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#686f78]">
            {label}
          </p>

          <p
            className={cn(
              "mt-2 text-[28px] font-semibold leading-none tracking-[-0.045em]",
              toneClass
            )}
          >
            {value}
          </p>

          <p className="mt-2 text-[9px] text-[#747c85]">{delta}</p>
        </div>

        {Icon ? (
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border",
              tone === "gold"
                ? "border-[#d8b66f]/16 bg-[#d8b66f]/10 text-[#d8b66f]"
                : tone === "green"
                  ? "border-[#6fa58e]/16 bg-[#6fa58e]/10 text-[#7eae99]"
                  : "border-white/[0.065] bg-white/[0.025] text-[#737b84]"
            )}
          >
            <Icon size={13} strokeWidth={1.6} aria-hidden />
          </div>
        ) : null}
      </div>

      {sparkline ? (
        <div key={`spark-${motionKey ?? "static"}`} className="mku-sparkline-draw">
          <MockupSparkline points={sparkline} tone={tone} />
        </div>
      ) : null}
    </MockupPanel>
  );
}

export function MockupBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "gold" | "green" | "neutral";
}) {
  return (
    <span
      className={cn(
        "mku-badge inline-flex items-center rounded-full border px-2 py-1 text-[8px] font-medium",
        tone === "gold"
          ? "border-[#d8b66f]/16 bg-[#d8b66f]/10 text-[#dfc180]"
          : tone === "green"
            ? "border-[#6fa58e]/16 bg-[#6fa58e]/10 text-[#8fc0aa]"
            : "border-white/[0.065] bg-white/[0.025] text-[#8b939c]"
      )}
    >
      {children}
    </span>
  );
}

export function MockupTimelineItem({
  time,
  title,
  detail,
  icon: Icon,
  active = false,
  last = false,
}: {
  time: string;
  title: string;
  detail: string;
  icon: LucideIcon;
  active?: boolean;
  last?: boolean;
}) {
  return (
    <article className={cn(
      "mku-timeline-item relative grid grid-cols-[42px_18px_minmax(0,1fr)] gap-3",
      active && "mku-timeline-item-active"
    )}>
      <time className="pt-0.5 text-right text-[8px] text-[#5f6770]">
        {time}
      </time>

      <div className="relative flex justify-center">
        <span
          className={cn(
            "relative z-[1] mt-1.5 h-2 w-2 rounded-full border",
            active
              ? "border-[#7eae99] bg-[#6fa58e] shadow-[0_0_10px_rgba(111,165,142,0.38)]"
              : "border-white/[0.16] bg-[#343a41]"
          )}
        />

        {!last ? (
          <span className="absolute bottom-[-15px] top-3 w-px bg-white/[0.04]" />
        ) : null}
      </div>

      <div className="min-w-0 pb-3.5">
        <div className="flex items-center gap-2">
          <Icon
            size={11}
            strokeWidth={1.6}
            className={active ? "text-[#7eae99]" : "text-[#727a83]"}
            aria-hidden
          />

          <p className="truncate text-[10.5px] font-medium text-[#d3d6da]">
            {title}
          </p>
        </div>

        <p className="mt-1 text-[8px] leading-relaxed text-[#69717a]">
          {detail}
        </p>
      </div>
    </article>
  );
}

export function MockupInsightCard({
  title,
  confidence,
  impact,
  active = false,
  featured = false,
}: {
  title: string;
  confidence: string;
  impact: string;
  active?: boolean;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "rounded-[13px] border p-3 transition-[border-color,background-color,transform] duration-500",
        featured
          ? "border-[#d8b66f]/22 bg-[#d8b66f]/[0.06]"
          : active
            ? "translate-y-[-1px] border-[#d8b66f]/18 bg-[#d8b66f]/[0.05]"
            : "border-white/[0.05] bg-black/[0.06]"
      )}
    >
      {featured ? (
        <div className="mb-2">
          <MockupBadge tone="gold">Top opportunity</MockupBadge>
        </div>
      ) : null}

      <p className="text-[10px] font-medium text-[#d0d4d7]">{title}</p>

      <div className="mt-2.5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[7.5px] uppercase tracking-[0.1em] text-[#626a73]">
            Confidence
          </p>

          <p className="mt-1 text-[12px] font-semibold text-[#7eae99]">
            {confidence}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[7.5px] uppercase tracking-[0.1em] text-[#626a73]">
            Impact
          </p>

          <p className="mt-1 text-[10.5px] font-semibold text-[#d8b66f]">
            {impact}
          </p>
        </div>
      </div>
    </article>
  );
}
