"use client";

import Link from "next/link";
import {
  Bell,
  Bot,
  Brush,
  CalendarCheck,
  CalendarClock,
  MessageSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SkeletonCrossfade } from "@/components/motion/SkeletonCrossfade";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Skeleton } from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { cardPaddingClass } from "@/lib/dashboard/design-system";
import { formatAdminDateShort } from "@/lib/dashboard/format";
import { formatTranslation, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import type { AiActivityItem, TimelineItem } from "./dashboard-metrics";
import { matchesDashboardSearch } from "./dashboard-ui";
import type { Booking } from "@/types/booking";

type Props = {
  timeline: TimelineItem[];
  aiActivity: AiActivityItem[];
  latestBookings: Booking[];
  loading: boolean;
  searchQuery?: string;
};

type ActivityEntry = {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  href?: string;
  icon: LucideIcon;
  tone: "accent" | "warning" | "info" | "neutral";
};

const TIMELINE_META = {
  check_in: { icon: CalendarCheck, tone: "accent" as const },
  check_out: { icon: CalendarClock, tone: "warning" as const },
  cleaning: { icon: Brush, tone: "info" as const },
  reminder: { icon: Bell, tone: "neutral" as const },
};

const TONE_CLASS = {
  accent: "text-[var(--shell-accent)]",
  warning: "text-amber-400",
  info: "text-sky-400",
  neutral: "text-[var(--shell-muted)]",
};

function formatRelativeTime(
  value: string,
  t: ReturnType<typeof useI18n>["t"],
  locale: ReturnType<typeof useI18n>["locale"]
): string {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) return t("dashboard.justNow");
  if (diffMinutes < 60) {
    return formatTranslation(t("dashboard.relativeMinutesAgo"), {
      count: String(diffMinutes),
    });
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return formatTranslation(t("dashboard.relativeHoursAgo"), {
      count: String(diffHours),
    });
  }

  return formatAdminDateShort(date, locale);
}

function buildActivityEntries(
  timeline: TimelineItem[],
  aiActivity: AiActivityItem[],
  latestBookings: Booking[],
  t: ReturnType<typeof useI18n>["t"],
  locale: ReturnType<typeof useI18n>["locale"]
): ActivityEntry[] {
  const entries: ActivityEntry[] = [];

  timeline.forEach((item) => {
    const meta = TIMELINE_META[item.kind];
    entries.push({
      id: item.id,
      time: item.time,
      title: item.title,
      subtitle: item.subtitle,
      icon: meta.icon,
      tone: meta.tone,
    });
  });

  aiActivity.slice(0, 4).forEach((item) => {
    entries.push({
      id: `ai-${item.id}`,
      time: formatRelativeTime(item.createdAt, t, locale),
      title: item.guestName,
      subtitle: item.preview,
      href: "/app/ai",
      icon: MessageSquare,
      tone: "accent",
    });
  });

  latestBookings.slice(0, 3).forEach((booking) => {
    entries.push({
      id: `booking-${booking.id}`,
      time: formatRelativeTime(booking.created_at, t, locale),
      title: booking.guest_name,
      subtitle: t("dashboard.activity.reservationCreated"),
      href: "/bookings",
      icon: Bot,
      tone: "neutral",
    });
  });

  return entries;
}

export function DashboardActivityFeed({
  timeline,
  aiActivity,
  latestBookings,
  loading,
  searchQuery = "",
}: Props) {
  const { locale, t } = useI18n();
  const entries = buildActivityEntries(
    timeline,
    aiActivity,
    latestBookings,
    t,
    locale
  );
  const filteredEntries = entries.filter((entry) =>
    matchesDashboardSearch(searchQuery, [entry.title, entry.subtitle, entry.time])
  );

  return (
    <GlassSurface
      interactive
      className={cn(cardPaddingClass, "overflow-hidden p-6 md:p-7")}
    >
      <div className="mb-6 space-y-1">
        <h2 className="ds-section-title">{t("dashboard.activity.title")}</h2>
        <p className="ds-caption text-[var(--shell-muted)]">
          {t("dashboard.activity.subtitle")}
        </p>
      </div>

      <SkeletonCrossfade
        loading={loading}
        skeleton={
          <div className="space-y-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-14 rounded-[var(--ds-radius-card)]"
              />
            ))}
          </div>
        }
      >
        {filteredEntries.length === 0 ? (
          <EmptyState
            title={t("dashboard.activity.emptyTitle")}
            description={t("dashboard.activity.emptyDesc")}
            icon={<CalendarCheck size={18} />}
          />
        ) : (
          <div
            className="relative"
            role="list"
            aria-label={t("dashboard.activity.ariaLabel")}
          >
            <div
              aria-hidden
              className="absolute bottom-2 left-[0.6875rem] top-2 w-px bg-gradient-to-b from-transparent via-[var(--shell-border)]/45 to-transparent"
            />

            {filteredEntries.map((entry, index) => {
              const Icon = entry.icon;
              const row = (
                <article
                  className={cn(
                    "relative flex gap-5 py-4",
                    index === 0 && "pt-0",
                    index === filteredEntries.length - 1 && "pb-0"
                  )}
                >
                  <div className="relative z-[1] flex w-6 shrink-0 justify-center pt-0.5">
                    <div
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full bg-[var(--shell-surface-raised)]/80 ring-1 ring-[var(--shell-border)]/25",
                        TONE_CLASS[entry.tone]
                      )}
                    >
                      <Icon size={12} aria-hidden className="opacity-80" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1 border-b border-[var(--shell-border)]/15 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between gap-4">
                      <p className="truncate text-[13px] font-medium leading-snug text-[var(--shell-text)]">
                        {entry.title}
                      </p>
                      <time className="shrink-0 text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--shell-muted)]">
                        {entry.time}
                      </time>
                    </div>
                    <p className="text-[12px] leading-relaxed text-[var(--shell-muted)]">
                      {entry.subtitle}
                    </p>
                  </div>
                </article>
              );

              if (!entry.href) {
                return (
                  <div key={entry.id} role="listitem">
                    {row}
                  </div>
                );
              }

              return (
                <Link
                  key={entry.id}
                  href={entry.href}
                  role="listitem"
                  className="block rounded-[var(--ds-radius-card)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]"
                >
                  {row}
                </Link>
              );
            })}
          </div>
        )}
      </SkeletonCrossfade>
    </GlassSurface>
  );
}
