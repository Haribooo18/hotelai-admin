"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resolveShellPageTitle } from "@/lib/dashboard/shell-nav";
import { cn } from "@/lib/utils";

export function TopBar() {
  const pathname = usePathname();
  const title = resolveShellPageTitle(pathname);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-[var(--shell-border)] bg-[var(--shell-topbar)]/90 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-6 px-6 lg:px-10">
        <div className="min-w-0 pl-12 lg:pl-0">
          <h1 className="truncate text-[20px] font-semibold tracking-[-0.02em] text-[var(--shell-text)]">
            {title}
          </h1>
          <p className="mt-0.5 text-[13px] text-[var(--shell-muted)]">
            Welcome back.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Input
            type="date"
            defaultValue={today}
            aria-label="Select date"
            className="hidden h-10 w-[156px] rounded-[12px] border-[var(--shell-border)] bg-[var(--shell-surface)] text-[13px] text-[var(--shell-text)] shadow-none transition-all duration-200 ease-out focus-visible:ring-emerald-500/30 sm:block"
          />

          <Link
            href="/bookings"
            className={cn(
              buttonVariants(),
              "h-10 gap-2 rounded-[12px] bg-emerald-600 px-4 text-[13px] font-medium text-white shadow-[var(--shell-shadow-sm)] transition-all duration-200 ease-out hover:bg-emerald-500"
            )}
          >
            <Plus size={16} />
            New reservation
          </Link>
        </div>
      </div>
    </header>
  );
}
