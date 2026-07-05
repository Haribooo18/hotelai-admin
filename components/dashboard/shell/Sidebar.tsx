"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { SIDEBAR_WIDTH_PX } from "@/lib/i18n/shell-pages";
import {
  isShellNavActive,
  SHELL_NAV_ITEMS,
} from "@/lib/dashboard/shell-nav";
import { cn } from "@/lib/utils";

import { SidebarItem } from "./SidebarItem";
import { SidebarProfile } from "./SidebarProfile";
import type { ShellHotelOption } from "./HotelSelector";

type Props = {
  hotel?: {
    id: string;
    name: string;
  };
  onMobileClose?: () => void;
  className?: string;
};

function SidebarPanel({ hotel, onMobileClose, className }: Props) {
  const pathname = usePathname();
  const { t } = useI18n();

  const hotelName = hotel?.name ?? "Monavel Hotel";
  const hotelId = hotel?.id ?? "hotel_aurora";
  const hotels: ShellHotelOption[] = [{ id: hotelId, name: hotelName }];

  return (
    <aside
      style={{ width: SIDEBAR_WIDTH_PX }}
      className={cn(
        "flex h-svh shrink-0 flex-col border-r border-[var(--shell-border)] bg-[var(--shell-sidebar)]",
        className
      )}
    >
      <div className="flex items-center px-3 pb-0.5 pt-3">
        <Link
          href="/dashboard"
          className="ds-wordmark inline-flex items-center gap-2 transition-opacity duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:opacity-80"
        >
          <span
            aria-hidden
            className="flex h-6 w-6 items-center justify-center rounded-[8px] bg-[var(--shell-accent-muted)] text-[11px] font-semibold text-[var(--shell-accent)]"
          >
            M
          </span>
          Monavel
        </Link>
      </div>

      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 py-2">
        {SHELL_NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.labelKey}
            href={item.href}
            label={t(item.labelKey)}
            icon={item.icon}
            active={isShellNavActive(pathname, item)}
            onNavigate={onMobileClose}
          />
        ))}
      </nav>

      <div className="shrink-0 border-t border-[var(--shell-border)] p-2">
        <SidebarProfile
          hotelName={hotelName}
          hotels={hotels}
          activeHotelId={hotelId}
        />
      </div>
    </aside>
  );
}

export function Sidebar({ hotel }: Pick<Props, "hotel">) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-[var(--ds-radius-sm)] border border-[var(--shell-border)] bg-[var(--shell-surface)] text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] transition-all duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:bg-[var(--shell-nav-hover-bg)] lg:hidden"
      >
        <Menu size={17} />
      </button>

      <div
        className="fixed inset-y-0 left-0 z-40 hidden lg:block"
        style={{ width: SIDEBAR_WIDTH_PX }}
      >
        <SidebarPanel hotel={hotel} className="h-svh" />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="ds-dialog-backdrop absolute inset-0 bg-black/45 backdrop-blur-[3px]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-svh">
            <SidebarPanel
              hotel={hotel}
              onMobileClose={() => setMobileOpen(false)}
              className="h-svh shadow-[var(--shell-shadow-lg)]"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
