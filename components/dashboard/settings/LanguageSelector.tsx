"use client";

import { cn } from "@/lib/utils";
import {
  ADMIN_LOCALES,
  LOCALE_LABELS,
  useI18n,
  type AdminLocale,
} from "@/lib/i18n";

export function LanguageSelector() {
  const { locale, setLocale } = useI18n();

  return (
    <div
      className="grid gap-2 sm:grid-cols-2"
      role="radiogroup"
      aria-label="Language"
    >
      {ADMIN_LOCALES.map((code) => {
        const selected = locale === code;

        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setLocale(code as AdminLocale)}
            className={cn(
              "rounded-[var(--ds-radius-sm)] border px-3 py-2.5 text-left text-[13px] transition-[background-color,border-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
              selected
                ? "border-[var(--shell-accent-border)] bg-[var(--shell-accent-muted)] text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)]"
                : "border-[var(--shell-border)] bg-[var(--shell-surface-raised)] text-[var(--shell-muted)] hover:border-[var(--shell-border-strong)] hover:text-[var(--shell-text)]"
            )}
          >
            {LOCALE_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
