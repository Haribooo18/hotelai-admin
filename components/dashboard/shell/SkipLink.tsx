"use client";

import { useI18n } from "@/lib/i18n";

export function SkipLink() {
  const { t } = useI18n();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--ds-radius-sm)] focus:bg-[var(--shell-surface)] focus:px-4 focus:py-2 focus:text-[13px] focus:font-medium focus:text-[var(--shell-text)] focus:shadow-[var(--shell-shadow-md)] focus:outline-none focus:ring-[3px] focus:ring-[var(--shell-accent-ring)]"
    >
      {t("a11y.skipToContent")}
    </a>
  );
}
