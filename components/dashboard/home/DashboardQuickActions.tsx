import Link from "next/link";
import {
  BedDouble,
  Bot,
  MessageSquare,
  Plus,
  UserPlus,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  DashboardSectionTitle,
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
    label: "Messages",
    href: "/ai",
    icon: MessageSquare,
    primary: false,
  },
  {
    label: "AI assistant",
    href: "/ai",
    icon: Bot,
    primary: false,
  },
] as const;

export function DashboardQuickActions() {
  return (
    <DashboardSurface className="p-6">
      <DashboardSectionTitle
        title="Quick actions"
        subtitle="Common tasks in one click"
      />

      <div className="grid gap-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.label}
              href={action.href}
              className={cn(
                buttonVariants({ variant: action.primary ? "default" : "outline" }),
                "h-12 w-full justify-start gap-3 rounded-[14px] border-0 px-4 text-[14px] font-medium shadow-[var(--shell-shadow-sm)] transition-all duration-[180ms] ease-out hover:-translate-y-0.5",
                action.primary
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : "bg-[var(--shell-nav-hover-bg)]/50 text-[var(--shell-text)] hover:bg-[var(--shell-nav-hover-bg)]"
              )}
            >
              <Icon size={18} />
              {action.label}
            </Link>
          );
        })}
      </div>
    </DashboardSurface>
  );
}
