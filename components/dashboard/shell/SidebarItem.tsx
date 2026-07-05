"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

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
        "group relative flex items-center gap-2.5 rounded-[var(--ds-radius-sm)] px-2.5 py-2 text-[13px] font-medium transition-[color,background-color,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
        active
          ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-nav-active-text)] shadow-[0_0_0_1px_var(--shell-accent-border),0_0_20px_oklch(0.58_0.11_162/8%)]"
          : "text-[var(--shell-nav-text)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-nav-active-text)]"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-[var(--shell-accent)] transition-[opacity,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
          active
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0 group-hover:scale-y-75 group-hover:opacity-40"
        )}
      />

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[var(--ds-radius-sm)] ring-1 ring-inset transition-opacity duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
          active
            ? "opacity-100 ring-[var(--shell-accent-border)]"
            : "opacity-0"
        )}
      />

      <Icon
        size={17}
        strokeWidth={active ? 2.25 : 1.75}
        className={cn(
          "relative shrink-0 transition-[color,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
          active
            ? "text-[var(--shell-accent)]"
            : "text-[var(--shell-nav-icon)] group-hover:text-[var(--shell-nav-active-text)]"
        )}
      />

      <span className="relative truncate">{label}</span>
    </Link>
  );
}
