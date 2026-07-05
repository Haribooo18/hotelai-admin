"use client";

import {
  Bot,
  BookOpen,
  CreditCard,
  Globe,
  Palette,
  Plug,
  Shield,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { SettingsSection } from "./settings-ops-metrics";

const NAV_ITEMS: Array<{
  id: SettingsSection;
  label: string;
  icon: typeof Bot;
}> = [
  { id: "general", label: "Общие", icon: Palette },
  { id: "ai", label: "AI", icon: Bot },
  { id: "channels", label: "Каналы", icon: Globe },
  { id: "knowledge", label: "База знаний", icon: BookOpen },
  { id: "billing", label: "Биллинг", icon: CreditCard },
  { id: "team", label: "Команда", icon: Users },
  { id: "security", label: "Безопасность", icon: Shield },
  { id: "integrations", label: "Интеграции", icon: Plug },
];

type Props = {
  active: SettingsSection;
  onChange: (section: SettingsSection) => void;
};

export function SettingsSidebar({ active, onChange }: Props) {
  return (
    <nav
      aria-label="Настройки"
      className="sticky top-[calc(var(--shell-header-height)+1rem)] rounded-[var(--ds-radius)] bg-[var(--shell-surface)]/85 p-2 shadow-[var(--shell-shadow-sm)] backdrop-blur-xl"
    >
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const selected = active === item.id;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onChange(item.id)}
                aria-current={selected ? "page" : undefined}
                className={cn(
                  "flex w-full min-h-11 items-center gap-2.5 rounded-[var(--ds-radius-sm)] px-3 py-2.5 text-left text-[13px] font-medium transition-[background-color,color,box-shadow] duration-[var(--ds-duration)] ease-[var(--ds-ease)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--shell-accent-ring)]",
                  selected
                    ? "bg-[var(--shell-accent-muted)] text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)]"
                    : "text-[var(--shell-muted)] hover:bg-[var(--shell-surface-raised)] hover:text-[var(--shell-text)]"
                )}
              >
                <Icon
                  size={16}
                  className={cn(
                    selected
                      ? "text-[var(--shell-accent)]"
                      : "text-[var(--shell-muted)]"
                  )}
                />
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
