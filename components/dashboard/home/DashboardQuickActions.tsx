import Link from "next/link";
import {
  BedDouble,
  Bot,
  CalendarDays,
  MessageSquare,
  Plus,
  UserPlus,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  DashboardPanelHeader,
  DashboardSurface,
} from "./DashboardPrimitives";

const ACTIONS = [
  {
    label: "New reservation",
    href: "/bookings",
    icon: Plus,
    primary: true,
  },
  {
    label: "New guest",
    href: "/guests",
    icon: UserPlus,
    primary: false,
  },
  {
    label: "Add room",
    href: "/rooms",
    icon: BedDouble,
    primary: false,
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: CalendarDays,
    primary: false,
  },
  {
    label: "AI inbox",
    href: "/ai",
    icon: MessageSquare,
    primary: false,
  },
  {
    label: "AI settings",
    href: "/settings",
    icon: Bot,
    primary: false,
  },
] as const;

export function DashboardQuickActions() {
  return (
    <DashboardSurface glass className="p-[var(--ds-surface-padding)]">
      <DashboardPanelHeader
        title="Quick actions"
        subtitle="Jump to common workflows"
      />

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.label}
              href={action.href}
              className={cn(
                "inline-flex h-[var(--ds-input-height)] items-center gap-2.5 rounded-[var(--ds-radius-sm)] px-3 text-[13px] font-medium shadow-[var(--shell-shadow-sm)] transition-[transform,background-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px",
                action.primary
                  ? "bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-[var(--shell-shadow-md)]"
                  : "bg-[var(--shell-surface-raised)] text-[var(--shell-text)] hover:bg-[var(--shell-nav-hover-bg)] hover:shadow-[var(--shell-shadow-md)]"
              )}
            >
              <Icon size={15} />
              {action.label}
            </Link>
          );
        })}
      </div>
    </DashboardSurface>
  );
}
