"use client";

import { useState } from "react";

import type { HotelAISettings } from "@/types/ai-settings";
import type { AIHealthStatus } from "@/types/ai-settings";
import type { AIObservabilityLog } from "@/types/ai-settings";
import type { HotelSubscription } from "@/types/subscription";

import {
  DashboardPageHeader,
  DashboardSectionTitle,
  DashboardSurface,
} from "@/components/dashboard/home/DashboardPrimitives";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { AIHealthPanel } from "./AIHealthPanel";
import { AIPromptTest } from "./AIPromptTest";
import { AISettingsForm } from "./AISettingsForm";
import { AppearancePanel } from "./AppearancePanel";
import { BillingPanel } from "./BillingPanel";

type Tab = "ai" | "billing" | "appearance";

type Props = {
  settings: HotelAISettings;
  health: AIHealthStatus;
  logs: AIObservabilityLog[];
  configured: boolean;
  subscription: HotelSubscription | null;
  stripeConfigured: boolean;
  initialTab?: Tab;
};

export function SettingsTabs({
  settings,
  health,
  logs,
  configured,
  subscription,
  stripeConfigured,
  initialTab = "ai",
}: Props) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const tabs: { id: Tab; labelKey: `settings.${keyof import("@/lib/i18n/translations").AdminTranslations["settings"]}` }[] = [
    { id: "ai", labelKey: "settings.ai" },
    { id: "billing", labelKey: "settings.billing" },
    { id: "appearance", labelKey: "settings.appearance" },
  ];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t("pages.settings.title")}
        subtitle={t("pages.settings.subtitle")}
      />

      <div className="flex gap-1 border-b border-[var(--shell-border)] pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-t-[var(--ds-radius-sm)] px-3.5 py-2 text-[13px] font-medium transition-[color,background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)]",
              activeTab === tab.id
                ? "bg-[var(--shell-surface)] text-[var(--shell-text)] shadow-[inset_0_-2px_0_var(--shell-accent)]"
                : "text-[var(--shell-muted)] hover:text-[var(--shell-text)]"
            )}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {activeTab === "ai" ? (
        <>
          <section className="grid gap-4 lg:grid-cols-2">
            <DashboardSurface interactive={false} className="p-[var(--ds-surface-padding)]">
              <DashboardSectionTitle title={t("settings.ai")} className="mb-4" />
              <AISettingsForm settings={settings} configured={configured} />
            </DashboardSurface>

            <div className="space-y-4">
              <AIHealthPanel health={health} />
              <AIPromptTest />
            </div>
          </section>

          {logs.length > 0 ? (
            <DashboardSurface interactive={false} className="p-[var(--ds-surface-padding)]">
              <DashboardSectionTitle
                title="Observability log"
                className="mb-4"
              />
              <ul className="max-h-64 space-y-2 overflow-y-auto text-[13px]">
                {logs.map((log) => (
                  <li
                    key={log.id}
                    className="flex justify-between gap-4 rounded-[var(--ds-radius-sm)] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] px-3 py-2"
                  >
                    <span className="text-[var(--shell-text)]">
                      <span className="text-[var(--shell-muted)]">
                        [{log.level}]
                      </span>{" "}
                      {log.event}
                    </span>
                    <span className="shrink-0 text-[11px] text-[var(--shell-muted)]">
                      {new Date(log.created_at).toLocaleString("en-US")}
                    </span>
                  </li>
                ))}
              </ul>
            </DashboardSurface>
          ) : null}
        </>
      ) : null}

      {activeTab === "billing" ? (
        <DashboardSurface interactive={false} className="p-[var(--ds-surface-padding)]">
          <DashboardSectionTitle
            title={t("settings.subscription")}
            subtitle={t("settings.subscriptionSubtitle")}
            className="mb-4"
          />
          <BillingPanel
            subscription={subscription}
            stripeConfigured={stripeConfigured}
          />
        </DashboardSurface>
      ) : null}

      {activeTab === "appearance" ? <AppearancePanel /> : null}
    </div>
  );
}
