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
  userEmail?: string;
  onMobileClose?: () => void;
  className?: string;
};

function SidebarPanel({ hotel, userEmail, onMobileClose, className }: Props) {
  const pathname = usePathname();
  const { t } = useI18n();

  const hotelName = hotel?.name ?? "Monavel Hotel";
  const hotelId = hotel?.id ?? "hotel_aurora";
  const hotels: ShellHotelOption[] = [{ id: hotelId, name: hotelName }];

  return (
    <aside
      style={{ width: SIDEBAR_WIDTH_PX }}
      className={cn(
        "ds-sidebar flex h-svh shrink-0 flex-col",
        className
      )}
    >
      <div className="flex items-center px-3.5 pb-1 pt-4">
        <Link
          href="/dashboard"
          className="ds-wordmark group inline-flex items-center gap-2.5 transition-opacity duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:opacity-90"
        >
          <span
            aria-hidden
            className="ds-wordmark-badge flex h-7 w-7 items-center justify-center rounded-[9px] text-[11px] font-semibold transition-transform duration-[var(--ds-duration)] ease-[var(--ds-ease)] group-hover:scale-[1.02]"
          >
            M
          </span>
          Monavel
        </Link>
      </div>

      <nav aria-label="Main navigation" className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2.5 py-3">
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

      <div className="ds-sidebar-profile shrink-0 px-2.5 pb-2.5 pt-2">
        <SidebarProfile
          hotelName={hotelName}
          hotels={hotels}
          activeHotelId={hotelId}
          userEmail={userEmail}
        />
      </div>
    </aside>
  );
}

export function Sidebar({ hotel, userEmail }: Pick<Props, "hotel" | "userEmail">) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setMobileOpen(true)}
        className="fixed left-3.5 top-3.5 z-50 flex h-11 w-11 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface)] text-[var(--shell-text)] shadow-[var(--shell-shadow-md)] transition-[transform,background-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:scale-[1.02] hover:bg-[var(--shell-surface-raised)] active:scale-[0.98] lg:hidden"
      >
        <Menu size={16} strokeWidth={2} />
      </button>

      <div
        className="fixed inset-y-0 left-0 z-40 hidden lg:block"
        style={{ width: SIDEBAR_WIDTH_PX }}
      >
        <SidebarPanel hotel={hotel} userEmail={userEmail} className="h-svh" />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="ds-dialog-backdrop absolute inset-0 bg-black/50 backdrop-blur-[4px]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-svh">
            <SidebarPanel
              hotel={hotel}
              userEmail={userEmail}
              onMobileClose={() => setMobileOpen(false)}
              className="h-svh shadow-[var(--shell-shadow-lg)]"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
