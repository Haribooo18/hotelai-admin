"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function TopBar() {
  const { t } = useI18n();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <header className="ds-topbar sticky top-0 z-30 shrink-0">
      <div className="flex h-[52px] items-center justify-end gap-2 px-4 lg:px-5">
        <div className="flex items-center gap-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface)]/60 p-1 shadow-[var(--shell-shadow-sm)] backdrop-blur-sm">
          <Input
            type="date"
            defaultValue={today}
            aria-label="Select date"
            className="hidden h-[var(--ds-input-height)] w-[140px] border-0 bg-transparent shadow-none focus-visible:ring-0 sm:block"
          />

          <Link
            href="/bookings"
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-[var(--ds-button-height)] gap-1.5 rounded-[var(--ds-radius-sm)] px-3 text-[12px] font-medium shadow-[var(--shell-shadow-accent)]"
            )}
          >
            <Plus size={14} strokeWidth={2.5} />
            {t("common.newReservation")}
          </Link>
        </div>
      </div>
    </header>
  );
}
