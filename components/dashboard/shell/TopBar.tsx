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
    <header className="sticky top-0 z-30 shrink-0 border-b border-[var(--shell-border)] bg-[var(--shell-topbar)]/88 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-end gap-2.5 px-5 lg:px-6">
        <Input
          type="date"
          defaultValue={today}
          aria-label="Select date"
          className="hidden w-[148px] sm:block"
        />

        <Link
          href="/bookings"
          className={cn(
            buttonVariants({ size: "sm" }),
            "h-[var(--ds-button-height)] gap-1.5 rounded-[var(--ds-radius-sm)] px-3.5 text-[13px]"
          )}
        >
          <Plus size={15} strokeWidth={2.25} />
          {t("common.newReservation")}
        </Link>
      </div>
    </header>
  );
}
