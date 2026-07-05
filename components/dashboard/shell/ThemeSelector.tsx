"use client";

import { cn } from "@/lib/utils";
import type { ShellTheme } from "@/lib/dashboard/shell-theme";

const THEMES: { id: ShellTheme; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "gray", label: "Gray" },
  { id: "dark", label: "Dark" },
];

type Props = {
  value: ShellTheme;
  onChange: (theme: ShellTheme) => void;
  compact?: boolean;
};

export function ThemeSelector({ value, onChange, compact = false }: Props) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-[10px] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] p-1",
        compact ? "w-full" : ""
      )}
      role="radiogroup"
      aria-label="Theme"
    >
      {THEMES.map((theme) => {
        const selected = value === theme.id;

        return (
          <button
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(theme.id)}
            className={cn(
              "flex-1 rounded-[8px] px-2 py-1.5 text-center text-[11px] font-medium transition-[color,background-color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
              selected
                ? "bg-[var(--shell-nav-active-bg)] text-[var(--shell-nav-active-text)] shadow-[var(--shell-shadow-sm)]"
                : "text-[var(--shell-muted)] hover:bg-[var(--shell-nav-hover-bg)] hover:text-[var(--shell-text)]"
            )}
          >
            {theme.label}
          </button>
        );
      })}
    </div>
  );
}
