"use client";

import {
  Bot,
  CreditCard,
  Globe,
  Plug,
  Settings2,
  Shield,
  Users,
} from "lucide-react";

import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { useI18n, type TranslationPath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { SettingsNavButton, type SettingsNavSection } from "./settings-ui";

const NAV_ITEMS: Array<{
  id: SettingsNavSection;
  labelKey: TranslationPath;
  icon: typeof Bot;
}> = [
  { id: "ai", labelKey: "settings.navAi", icon: Bot },
  { id: "channels", labelKey: "settings.navChannels", icon: Globe },
  { id: "billing", labelKey: "settings.navBilling", icon: CreditCard },
  { id: "security", labelKey: "settings.navSecurity", icon: Shield },
  { id: "team", labelKey: "settings.navTeam", icon: Users },
  { id: "integrations", labelKey: "settings.navIntegrations", icon: Plug },
  { id: "advanced", labelKey: "settings.navAdvanced", icon: Settings2 },
];

type Props = {
  active: SettingsNavSection;
  onChange: (section: SettingsNavSection) => void;
};

export function SettingsSidebar({ active, onChange }: Props) {
  const { t } = useI18n();

  return (
    <GlassSurface
      className={cn(
        "sticky top-0 self-start p-2 shadow-[var(--shell-shadow-sm)]"
      )}
    >
      <nav aria-label={t("a11y.settingsNav")}>
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
                  {t(item.labelKey)}
                </SettingsNavButton>
              </li>
            );
          })}
        </ul>
      </nav>
    </GlassSurface>
  );
}
