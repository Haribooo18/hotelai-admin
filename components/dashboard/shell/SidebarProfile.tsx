"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, ChevronUp, LogOut, Settings, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n";
import { signOut } from "@/lib/services/auth.mutations";
import { cn } from "@/lib/utils";

import type { ShellHotelOption } from "./HotelSelector";

type Props = {
  hotelName: string;
  hotels: ShellHotelOption[];
  activeHotelId: string;
  userEmail?: string;
  onSelectHotel?: (hotelId: string) => void;
};

function hotelInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "M";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function SidebarProfile({
  hotelName,
  hotels,
  activeHotelId,
  userEmail = "admin@hotel.com",
  onSelectHotel,
}: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const [pending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(() => {
      void signOut();
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "group flex min-w-0 flex-1 items-center gap-3 rounded-[var(--ds-radius-card)] border border-[var(--shell-border)]/55 bg-[var(--shell-sidebar-elevated)] px-3 py-3 text-left shadow-[var(--shell-shadow-sm)] transition-[background-color,box-shadow,border-color,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
            "hover:border-[var(--shell-border-strong)] hover:bg-[var(--shell-surface)] hover:shadow-[var(--shell-shadow-md)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)] active:scale-[0.99]"
          )}
        >
          <div
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--shell-accent-muted)] text-[11px] font-semibold tracking-[0.02em] text-[var(--shell-accent)]"
          >
            {hotelInitials(hotelName)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold tracking-[-0.01em] text-[var(--shell-text)]">
              {hotelName}
            </p>
            <p className="truncate text-[11px] text-[var(--shell-muted)]">
              {t("profile.defaultPlan")}
            </p>
            <span className="sr-only">{userEmail}</span>
          </div>

          <ChevronUp
            size={14}
            className="shrink-0 text-[var(--shell-muted)] transition-transform duration-[var(--ds-duration)] ease-[var(--ds-ease)] group-data-popup-open:rotate-180"
            aria-hidden
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          side="top"
          sideOffset={10}
          className="w-[var(--anchor-width)] min-w-52 rounded-[var(--ds-radius-dropdown)] border border-[var(--shell-border)] bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-lg)]"
        >
          <DropdownMenuItem
            className="rounded-[var(--ds-radius-sm)] px-2.5 py-2 text-[12px]"
            onClick={() => router.push("/settings")}
          >
            <User size={14} />
            {t("profile.profile")}
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="rounded-[var(--ds-radius-sm)] px-2.5 py-2 text-[12px]">
              <Building2 size={14} />
              {t("profile.switchProperty")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="rounded-[var(--ds-radius-dropdown)] border border-[var(--shell-border)] bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]">
              {hotels.map((hotel) => (
                <DropdownMenuItem
                  key={hotel.id}
                  className={cn(
                    "rounded-[var(--ds-radius-sm)] px-2.5 py-2 text-[12px]",
                    hotel.id === activeHotelId &&
                      "bg-[var(--shell-nav-active-bg)] text-[var(--shell-nav-active-text)]"
                  )}
                  onClick={() => onSelectHotel?.(hotel.id)}
                >
                  {hotel.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator className="bg-[var(--shell-border)]" />

          <DropdownMenuItem
            className="rounded-[var(--ds-radius-sm)] px-2.5 py-2 text-[12px] text-red-400"
            disabled={pending}
            onClick={handleSignOut}
          >
            <LogOut size={14} />
            {pending ? t("profile.signingOut") : t("profile.signOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link
        href="/settings"
        aria-label={t("profile.settingsShortcut")}
        className={cn(
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--ds-radius-button)] border border-[var(--shell-border)]/55 bg-[var(--shell-sidebar-elevated)] text-[var(--shell-muted)] shadow-[var(--shell-shadow-sm)] transition-[background-color,border-color,color,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
          "hover:border-[var(--shell-border-strong)] hover:bg-[var(--shell-surface)] hover:text-[var(--shell-text)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)] active:scale-[0.98]"
        )}
      >
        <Settings size={15} aria-hidden />
      </Link>
    </div>
  );
}
