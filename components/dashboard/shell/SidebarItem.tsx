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
        "group relative ds-body flex h-9 items-center gap-2.5 rounded-[var(--ds-radius-sm)] px-2.5 font-medium tracking-[-0.01em] transition-[color,background-color,box-shadow,transform] duration-[var(--ds-duration-short)] ease-[var(--ds-ease)]",
        active
          ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-nav-active-text)] shadow-[0_0_0_1px_var(--shell-accent-border),0_4px_14px_oklch(0.45_0.1_162/10%)]"
          : "text-[var(--shell-nav-text)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-nav-active-text)] active:scale-[0.99]"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[var(--shell-accent)] transition-[opacity,transform,box-shadow] duration-[var(--ds-duration-short)] ease-[var(--ds-ease)]",
          active
            ? "scale-y-100 opacity-100 shadow-[0_0_10px_oklch(0.58_0.11_162/55%)]"
            : "scale-y-50 opacity-0 group-hover:opacity-35"
        )}
      />

      <Icon
        size={16}
        strokeWidth={active ? 2.25 : 1.85}
        className={cn(
          "relative shrink-0 transition-[color,transform] duration-[var(--ds-duration-short)] ease-[var(--ds-ease)]",
          active
            ? "text-[var(--shell-accent)]"
            : "text-[var(--shell-nav-icon)] group-hover:text-[var(--shell-nav-active-text)]"
        )}
      />

      <span className="relative truncate">{label}</span>
    </Link>
  );
}
