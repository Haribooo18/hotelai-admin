"use client";

import {
  Bot,
  CreditCard,
  Globe,
  Palette,
  Plug,
  Settings2,
  Shield,
  Users,
} from "lucide-react";

import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { cn } from "@/lib/utils";

import { SettingsNavButton, type SettingsNavSection } from "./settings-ui";

const NAV_ITEMS: Array<{
  id: SettingsNavSection;
  label: string;
  icon: typeof Bot;
}> = [
  { id: "ai", label: "AI", icon: Bot },
  { id: "channels", label: "Channels", icon: Globe },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "general", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Shield },
  { id: "team", label: "Team", icon: Users },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "advanced", label: "Advanced", icon: Settings2 },
];

type Props = {
  active: SettingsNavSection;
  onChange: (section: SettingsNavSection) => void;
};

export function SettingsSidebar({ active, onChange }: Props) {
  return (
    <GlassSurface
      className={cn(
        "sticky top-[calc(var(--shell-header-height)+1rem)] p-2 shadow-[var(--shell-shadow-sm)]"
      )}
    >
      <nav aria-label="Settings navigation">
        <ul className="space-y-1" role="list">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const selected = active === item.id;

            return (
              <li key={item.id} role="listitem">
                <SettingsNavButton
                  selected={selected}
                  aria-current={selected ? "page" : undefined}
                  onClick={() => onChange(item.id)}
                >
                  <Icon
                    size={16}
                    aria-hidden
                    className={cn(
                      selected
                        ? "text-[var(--shell-accent)]"
                        : "text-[var(--shell-muted)]"
                    )}
                  />
                  {item.label}
                </SettingsNavButton>
              </li>
            );
          })}
        </ul>
      </nav>
    </GlassSurface>
  );
}
