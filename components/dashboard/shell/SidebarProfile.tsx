"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, ChevronUp, LogOut, User } from "lucide-react";

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
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex w-full items-center gap-2.5 rounded-[var(--ds-radius-sm)] bg-[var(--shell-sidebar-elevated)] px-2.5 py-2 text-left shadow-[var(--shell-shadow-sm)] transition-[background-color,box-shadow,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
          "hover:bg-[var(--shell-surface)] hover:shadow-[var(--shell-shadow-md)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)] active:scale-[0.99]"
        )}
      >
        <div
          aria-hidden
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[var(--shell-accent-muted)] text-[10px] font-semibold tracking-[0.02em] text-[var(--shell-accent)]"
        >
          {hotelInitials(hotelName)}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-medium tracking-[-0.01em] text-[var(--shell-text)]">
            {hotelName}
          </p>
          <p className="truncate text-[11px] text-[var(--shell-muted)]">
            {userEmail}
          </p>
        </div>

        <ChevronUp
          size={13}
          className="shrink-0 text-[var(--shell-muted)] transition-transform duration-[var(--ds-duration)] ease-[var(--ds-ease)] group-data-popup-open:rotate-180"
          aria-hidden
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={10}
        className="w-[var(--anchor-width)] min-w-52 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-lg)]"
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
          <DropdownMenuSubContent className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]">
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
  );
}
