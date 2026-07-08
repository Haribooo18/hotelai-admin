"use client";

import { ChevronDown, Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { toolbarControlClass } from "@/lib/dashboard/design-system";
import {
  ADMIN_LOCALES,
  LOCALE_LABELS,
  useI18n,
  type AdminLocale,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LOCALE_SHORT_LABELS: Record<AdminLocale, string> = {
  en: "EN",
  uk: "UK",
  ru: "RU",
  pl: "PL",
  de: "DE",
};

type Props = {
  className?: string;
};

export function ToolbarLanguageDropdown({ className }: Props) {
  const { locale, setLocale } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(toolbarControlClass, "gap-1.5 px-2.5", className)}
        aria-label="Language"
      >
        <Globe size={14} aria-hidden className="shrink-0 text-[var(--shell-muted)]" />
        <span>{LOCALE_SHORT_LABELS[locale]}</span>
        <ChevronDown size={14} aria-hidden className="text-[var(--shell-muted)]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[148px]">
        {ADMIN_LOCALES.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLocale(code)}
            className={cn(locale === code && "bg-[var(--shell-nav-active-bg)]")}
          >
            <span className="min-w-8 font-medium">{LOCALE_SHORT_LABELS[code]}</span>
            <span className="text-[var(--shell-muted)]">{LOCALE_LABELS[code]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
