"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { SignOutButton } from "@/components/auth/SignOutButton";
import {
  isShellNavActive,
  SHELL_NAV_ITEMS,
} from "@/lib/dashboard/shell-nav";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

import { HotelSelector } from "./HotelSelector";
import { SidebarItem } from "./SidebarItem";
import { SidebarSection } from "./SidebarSection";
import { ThemeSelector } from "./ThemeSelector";
import { useShellTheme } from "./useShellTheme";

type Props = {
  hotel?: {
    id: string;
    name: string;
  };
  onMobileClose?: () => void;
  className?: string;
};

function resolveDisplayName(
  email: string | undefined,
  metadataName: string | undefined
): string {
  if (metadataName?.trim()) {
    return metadataName.trim();
  }

  if (email) {
    const local = email.split("@")[0] ?? "User";
    return local
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  return "Manager";
}

function SidebarPanel({ hotel, onMobileClose, className }: Props) {
  const pathname = usePathname();
  const [theme, setTheme] = useShellTheme();
  const [displayName, setDisplayName] = useState("Manager");
  const [email, setEmail] = useState("admin@hotel.com");

  const hotelName = hotel?.name ?? "Monavel Hotel";
  const hotelId = hotel?.id ?? "hotel_aurora";
  const hotels = [{ id: hotelId, name: hotelName }];

  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return;

      const userEmail = user.email ?? "admin@hotel.com";
      const metadataName =
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : typeof user.user_metadata?.name === "string"
            ? user.user_metadata.name
            : undefined;

      setEmail(userEmail);
      setDisplayName(resolveDisplayName(userEmail, metadataName));
    });
  }, []);

  return (
    <aside
      className={cn(
        "flex h-full w-[280px] shrink-0 flex-col rounded-[24px] border border-[var(--shell-border)] bg-[var(--shell-sidebar)] shadow-[var(--shell-shadow-md)]",
        className
      )}
    >
      <div className="px-6 pb-2 pt-7">
        <Link
          href="/dashboard"
          className="inline-block text-[22px] font-semibold tracking-[-0.03em] text-[var(--shell-text)] transition-opacity duration-200 ease-out hover:opacity-80"
        >
          Monavel
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
        <SidebarSection>
          {SHELL_NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.label}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isShellNavActive(pathname, item)}
              onNavigate={onMobileClose}
            />
          ))}
        </SidebarSection>
      </nav>

      <div className="space-y-5 border-t border-[var(--shell-border)] px-4 py-5">
        <HotelSelector hotels={hotels} activeHotelId={hotelId} />

        <ThemeSelector value={theme} onChange={setTheme} />

        <div className="rounded-[12px] border border-[var(--shell-border)] bg-[var(--shell-surface)] p-3">
          <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
            {displayName}
          </p>
          <p className="mt-0.5 truncate text-[12px] text-[var(--shell-muted)]">
            {email}
          </p>

          <div className="mt-3 border-t border-[var(--shell-border)] pt-3">
            <SignOutButton
              className="w-full justify-start gap-2 rounded-[10px] border-0 bg-transparent px-0 py-1 text-[13px] text-[var(--shell-muted)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)]"
              showIcon={false}
            />
          </div>
        </div>
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
        aria-label="Открыть навигацию"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-[12px] border border-[var(--shell-border)] bg-[var(--shell-surface)] text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] transition-all duration-200 ease-out hover:bg-[var(--shell-nav-hover-bg)] lg:hidden"
      >
        <Menu size={18} />
      </button>

      <div className="hidden lg:flex lg:shrink-0">
        <SidebarPanel hotel={hotel} />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Закрыть навигацию"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-3 top-3 bottom-3">
            <SidebarPanel
              hotel={hotel}
              onMobileClose={() => setMobileOpen(false)}
              className="h-full shadow-[var(--shell-shadow-lg)]"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
