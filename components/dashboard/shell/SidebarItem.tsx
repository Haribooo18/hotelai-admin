"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { sidebarNavItemClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";

const SIDEBAR_ICON_SIZE = 16;

type Props = {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  onNavigate?: () => void;
};

export function SidebarItem({
  href,
  label,
  icon: Icon,
  active = false,
  onNavigate,
}: Props) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        sidebarNavItemClass,
        active
          ? "bg-[var(--shell-nav-active-bg)] font-semibold text-[var(--shell-text)]"
          : "font-medium text-[var(--shell-nav-text)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-nav-active-text)] active:scale-[0.99]"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-1/2 w-1 -translate-y-1/2 rounded-full bg-[var(--shell-accent)] transition-[opacity,transform] duration-[var(--ds-duration-short)] ease-[var(--ds-ease)]",
          active
            ? "h-6 opacity-100"
            : "h-4 opacity-0 group-hover:opacity-40"
        )}
      />

      <Icon
        size={SIDEBAR_ICON_SIZE}
        strokeWidth={active ? 2.35 : 1.75}
        className={cn(
          "relative shrink-0 transition-[color,opacity] duration-[var(--ds-duration-short)] ease-[var(--ds-ease)]",
          active
            ? "text-[var(--shell-accent)]"
            : "text-[var(--shell-nav-icon)] opacity-70 group-hover:text-[var(--shell-nav-active-text)] group-hover:opacity-100"
        )}
      />

      <span className="relative truncate">{label}</span>
    </Link>
  );
}
