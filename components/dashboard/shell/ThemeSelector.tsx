"use client";

import { cn } from "@/lib/utils";
import type { ShellTheme } from "@/lib/dashboard/shell-theme";

const THEMES: { id: ShellTheme; label: string }[] = [
  { id: "light", label: "Светлая" },
  { id: "gray", label: "Серая" },
  { id: "dark", label: "Тёмная" },
];

type Props = {
  value: ShellTheme;
  onChange: (theme: ShellTheme) => void;
};

export function ThemeSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--shell-muted)]">
        Тема
      </p>

      <div className="space-y-1">
        {THEMES.map((theme) => {
          const selected = value === theme.id;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onChange(theme.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2 text-left text-[13px] transition-all duration-200 ease-out",
                selected
                  ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-nav-active-text)]"
                  : "text-[var(--shell-nav-text)] hover:bg-[var(--shell-nav-hover-bg)]"
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors duration-200 ease-out",
                  selected
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-[var(--shell-border)] bg-transparent"
                )}
              >
                {selected ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                ) : null}
              </span>
              <span>{theme.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
