"use client";

import { useMemo, type ReactNode } from "react";
import { Globe, Lock, Mail, MessageCircle, Send } from "lucide-react";

import type {
  AIHealthStatus,
  HotelAISettings,
} from "@/types/ai-settings";
import type { HotelSubscription } from "@/types/subscription";

import { Badge } from "@/components/ui/display/Badge";
import { DataCard } from "@/components/ui/data/DataCard";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { useI18n } from "@/lib/i18n";
import { workspaceSurfaceClass } from "@/lib/dashboard/design-system";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import { AISettingsForm } from "./AISettingsForm";
import { BillingPanel } from "./BillingPanel";
import { buildChannelStatuses } from "./settings-ops-metrics";
import {
  SettingsSectionPanel,
  settingsSectionStackClass,
  type SettingsNavSection,
} from "./settings-ui";

type Props = {
  section: SettingsNavSection;
  settings: HotelAISettings;
  health: AIHealthStatus;
  configured: boolean;
  subscription: HotelSubscription | null;
  stripeConfigured: boolean;
};

const CHANNEL_ICONS = {
  telegram: Send,
  website: Globe,
  email: Mail,
  whatsapp: MessageCircle,
} as const;

export function SettingsWorkspace({
  section,
  settings,
  health,
  configured,
  subscription,
  stripeConfigured,
}: Props) {
  const { locale, t } = useI18n();

  const channels = useMemo(
    () => buildChannelStatuses(settings, health, locale),
    [settings, health, locale]
  );

  return (
    <GlassSurface className={workspaceSurfaceClass}>
      <div className={settingsSectionStackClass}>{renderSection()}</div>
    </GlassSurface>
  );

  function renderSection() {
    switch (section) {
      case "ai":
        return (
          <SettingsSectionPanel
            title={t("settings.aiConfigTitle")}
            subtitle={t("settings.aiConfigSubtitle")}
          >
            <AISettingsForm settings={settings} configured={configured} />
          </SettingsSectionPanel>
        );
      case "channels":
        return (
          <SettingsSectionPanel
            title={t("settings.channelsTitle")}
            subtitle={t("settings.channelsSubtitle")}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {channels.map((channel) => {
                const Icon =
                  CHANNEL_ICONS[channel.id as keyof typeof CHANNEL_ICONS] ??
                  Globe;

                return (
                  <DataCard
                    key={channel.id}
                    interactive
                    title={channel.label}
                    subtitle={channel.description}
                    className={cn(
                      motionPresets.transitionBase,
                      motionPresets.hover.surfaceLift
                    )}
                    action={
                      <Badge variant={channel.connected ? "success" : "outline"}>
                        {channel.connected ? t("common.connected") : t("common.pending")}
                      </Badge>
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)]">
                        <Icon size={18} aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] text-[var(--shell-text)]">
                          {t("settings.channelsConfigHint")}
                        </p>
                      </div>
                    </div>
                  </DataCard>
                );
              })}
            </div>
          </SettingsSectionPanel>
        );
      case "billing":
        return (
          <SettingsSectionPanel
            title={t("settings.billingTitle")}
            subtitle={t("settings.billingSubtitle")}
          >
            <BillingPanel
              subscription={subscription}
              stripeConfigured={stripeConfigured}
            />
          </SettingsSectionPanel>
        );
      case "team":
        return (
          <PlaceholderPanel
            title={t("settings.teamTitle")}
            subtitle={t("settings.teamSubtitle")}
            hint={t("settings.placeholderHint")}
          />
        );
      case "security":
        return (
          <PlaceholderPanel
            title={t("settings.securityTitle")}
            subtitle={t("settings.securitySubtitle")}
            hint={t("settings.placeholderHint")}
            icon={<Lock size={18} />}
          />
        );
      case "integrations":
        return (
          <PlaceholderPanel
            title={t("settings.integrationsTitle")}
            subtitle={t("settings.integrationsSubtitle")}
            hint={t("settings.placeholderHint")}
          />
        );
      case "advanced":
        return (
          <PlaceholderPanel
            title={t("settings.advancedTitle")}
            subtitle={t("settings.advancedSubtitle")}
            hint={t("settings.placeholderHint")}
          />
        );
      default:
        return null;
    }
  }
}

function PlaceholderPanel({
  title,
  subtitle,
  hint,
  icon,
}: {
  title: string;
  subtitle: string;
  hint: string;
  icon?: ReactNode;
}) {
  return (
    <SettingsSectionPanel title={title} subtitle={subtitle}>
      <div className="flex items-center gap-3 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-4">
        {icon}
        <p className="text-[13px] text-[var(--shell-muted)]">{hint}</p>
      </div>
    </SettingsSectionPanel>
  );
}
