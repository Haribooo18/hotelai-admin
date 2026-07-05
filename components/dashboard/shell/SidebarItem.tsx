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
        "group relative flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ease-out",
        active
          ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-nav-active-text)] shadow-[var(--shell-shadow-sm)]"
          : "text-[var(--shell-nav-text)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-nav-active-text)]"
      )}
    >
      {active ? (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-emerald-500"
        />
      ) : null}

      <Icon
        size={18}
        className={cn(
          "shrink-0 transition-transform duration-200 ease-out group-hover:scale-[1.03]",
          active ? "text-emerald-500" : "text-[var(--shell-nav-icon)]"
        )}
      />

      <span>{label}</span>
    </Link>
  );
}
