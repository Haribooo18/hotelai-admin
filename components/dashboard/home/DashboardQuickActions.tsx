"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  BedDouble,
  Bot,
  CalendarDays,
  MessageSquare,
  Plus,
  UserPlus,
} from "lucide-react";

import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { Section } from "@/components/ui/primitives/Section";
import { cardPaddingClass } from "@/lib/dashboard/design-system";
import { motionPresets } from "@/lib/design/motion";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function DashboardQuickActions() {
  const { t } = useI18n();

  const actions = useMemo(
    () =>
      [
        {
          label: t("dashboard.newReservation"),
          href: "/bookings",
          icon: Plus,
          primary: true,
        },
        {
          label: t("dashboard.newGuest"),
          href: "/guests",
          icon: UserPlus,
          primary: false,
        },
        {
          label: t("dashboard.addRoom"),
          href: "/rooms",
          icon: BedDouble,
          primary: false,
        },
        {
          label: t("dashboard.calendar"),
          href: "/calendar",
          icon: CalendarDays,
          primary: false,
        },
        {
          label: t("dashboard.aiInbox"),
          href: "/ai",
          icon: MessageSquare,
          primary: false,
        },
        {
          label: t("dashboard.aiSettings"),
          href: "/settings",
          icon: Bot,
          primary: false,
        },
      ] as const,
    [t]
  );

  return (
    <GlassSurface className={cn("overflow-hidden", cardPaddingClass)}>
      <Section
        title={t("dashboard.quickActionsTitle")}
        subtitle={t("dashboard.quickActionsSubtitle")}
      />

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "inline-flex h-[var(--ds-input-height)] items-center gap-2.5 rounded-[var(--ds-radius-sm)] px-3 text-[13px] font-medium shadow-[var(--shell-shadow-sm)]",
                motionPresets.transitionBase,
                motionPresets.hover.surfaceLift,
                "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]",
                action.primary
                  ? "bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-[var(--shell-shadow-md)]"
                  : "bg-[var(--shell-surface-raised)] text-[var(--shell-text)] hover:bg-[var(--shell-nav-hover-bg)] hover:shadow-[var(--shell-shadow-md)]"
              )}
            >
              <Icon size={15} aria-hidden />
              {action.label}
            </Link>
          );
        })}
      </div>
    </GlassSurface>
  );
}
