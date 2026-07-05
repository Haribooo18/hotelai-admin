"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  ChevronUp,
  Globe,
  LogOut,
  Palette,
  User,
} from "lucide-react";

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
import {
  ADMIN_LOCALES,
  LOCALE_LABELS,
  useI18n,
  type AdminLocale,
} from "@/lib/i18n";
import { signOut } from "@/lib/services/auth.mutations";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

import type { ShellHotelOption } from "./HotelSelector";

type Props = {
  hotelName: string;
  hotels: ShellHotelOption[];
  activeHotelId: string;
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
  onSelectHotel,
}: Props) {
  const router = useRouter();
  const { locale, setLocale, t } = useI18n();
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("admin@hotel.com");

  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user?.email) return;
      setEmail(user.email);
    });
  }, []);

  function handleSignOut() {
    startTransition(() => {
      void signOut();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex w-full items-center gap-2.5 rounded-[var(--ds-radius-sm)] border border-[var(--shell-border)] bg-[var(--shell-surface)] px-2.5 py-2 text-left transition-[background-color,border-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
          "hover:border-[var(--shell-border-strong)] hover:bg-[var(--shell-surface-raised)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]"
        )}
      >
        <div
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[var(--shell-accent-muted)] text-[11px] font-semibold text-[var(--shell-accent)]"
        >
          {hotelInitials(hotelName)}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-medium text-[var(--shell-text)]">
            {hotelName}
          </p>
          <p className="truncate text-[11px] text-[var(--shell-muted)]">
            {email}
          </p>
        </div>

        <ChevronUp
          size={14}
          className="shrink-0 text-[var(--shell-muted)]"
          aria-hidden
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={8}
        className="w-[var(--anchor-width)] min-w-56 rounded-[var(--ds-radius-sm)] border-[var(--shell-border)] bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]"
      >
        <DropdownMenuItem
          className="rounded-[10px] px-2.5 py-2 text-[12px]"
          onClick={() => router.push("/settings")}
        >
          <User size={14} />
          {t("profile.profile")}
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="rounded-[10px] px-2.5 py-2 text-[12px]">
            <Building2 size={14} />
            {t("profile.switchProperty")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="rounded-[var(--ds-radius-sm)] border-[var(--shell-border)] bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]">
            {hotels.map((hotel) => (
              <DropdownMenuItem
                key={hotel.id}
                className={cn(
                  "rounded-[10px] px-2.5 py-2 text-[12px]",
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

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="rounded-[10px] px-2.5 py-2 text-[12px]">
            <Globe size={14} />
            {t("profile.language")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="rounded-[var(--ds-radius-sm)] border-[var(--shell-border)] bg-[var(--shell-surface)] p-1 shadow-[var(--shell-shadow-md)]">
            {ADMIN_LOCALES.map((code) => (
              <DropdownMenuItem
                key={code}
                className={cn(
                  "rounded-[10px] px-2.5 py-2 text-[12px]",
                  locale === code &&
                    "bg-[var(--shell-nav-active-bg)] text-[var(--shell-nav-active-text)]"
                )}
                onClick={() => setLocale(code as AdminLocale)}
              >
                {LOCALE_LABELS[code]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem
          className="rounded-[10px] px-2.5 py-2 text-[12px]"
          onClick={() => router.push("/settings?tab=appearance")}
        >
          <Palette size={14} />
          {t("profile.appearance")}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-[var(--shell-border)]" />

        <DropdownMenuItem
          className="rounded-[10px] px-2.5 py-2 text-[12px] text-red-400"
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
