"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Drawer, DrawerContent } from "@/components/ui/overlay/Drawer";
import { useI18n } from "@/lib/i18n";
import { SIDEBAR_WIDTH_PX } from "@/lib/i18n/shell-pages";
import {
  isShellNavActive,
  SHELL_PRIMARY_NAV_ITEMS,
  SHELL_SETTINGS_NAV_ITEM,
} from "@/lib/dashboard/shell-nav";
import { cn } from "@/lib/utils";

import { SidebarItem } from "./SidebarItem";
import { SidebarProfile } from "./SidebarProfile";
import { ShellWordmark } from "./ShellWordmark";
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
        "ds-sidebar flex h-svh shrink-0 flex-col overflow-y-auto",
        className
      )}
    >
      <div className="flex shrink-0 items-center px-3.5 pb-1 pt-4 lg:hidden">
        <ShellWordmark />
      </div>

      <div className="flex flex-col px-2.5 pb-2.5 pt-3">
        <nav aria-label={t("a11y.mainNav")} className="space-y-0.5">
          {SHELL_PRIMARY_NAV_ITEMS.map((item) => (
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

        <nav aria-label={t("a11y.settingsNav")} className="mt-0.5">
          <SidebarItem
            href={SHELL_SETTINGS_NAV_ITEM.href}
            label={t(SHELL_SETTINGS_NAV_ITEM.labelKey)}
            icon={SHELL_SETTINGS_NAV_ITEM.icon}
            active={isShellNavActive(pathname, SHELL_SETTINGS_NAV_ITEM)}
            onNavigate={onMobileClose}
          />
        </nav>

        <div
          role="separator"
          aria-orientation="horizontal"
          className="mt-4 border-t border-[var(--shell-border)]/55"
        />

        <div className="mt-3">
          <SidebarProfile
            hotelName={hotelName}
            hotels={hotels}
            activeHotelId={hotelId}
            userEmail={userEmail}
          />
        </div>
      </div>
    </aside>
  );
}

export function Sidebar({ hotel, userEmail }: Pick<Props, "hotel" | "userEmail">) {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={t("a11y.openNav")}
        onClick={() => setMobileOpen(true)}
        className="fixed left-3.5 top-3.5 z-50 flex h-11 w-11 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface)] text-[var(--shell-text)] shadow-[var(--shell-shadow-md)] transition-[transform,background-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:scale-[1.02] hover:bg-[var(--shell-surface-raised)] active:scale-[0.98] lg:hidden"
      >
        <Menu size={16} strokeWidth={2} />
      </button>

      <div
        className="fixed left-0 z-40 hidden lg:block"
        style={{
          width: SIDEBAR_WIDTH_PX,
          top: "var(--shell-header-height)",
          height: "calc(100svh - var(--shell-header-height))",
        }}
      >
        <SidebarPanel
          hotel={hotel}
          userEmail={userEmail}
          className="h-full"
        />
      </div>

      <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
        <DrawerContent
          showCloseButton={false}
          className="left-0 right-auto max-w-none border-r border-l-0 shadow-[var(--shell-shadow-lg)]"
          style={{ width: SIDEBAR_WIDTH_PX }}
        >
          <SidebarPanel
            hotel={hotel}
            userEmail={userEmail}
            onMobileClose={() => setMobileOpen(false)}
            className="h-svh"
          />
        </DrawerContent>
      </Drawer>
    </>
  );
}
