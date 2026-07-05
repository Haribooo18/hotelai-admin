"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import {
  BookOpen,
  Globe,
  Lock,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";

import type {
  AIHealthStatus,
  AIObservabilityLog,
  HotelAISettings,
} from "@/types/ai-settings";
import type { HotelSubscription } from "@/types/subscription";

import { Badge } from "@/components/ui/display/Badge";
import { DataCard } from "@/components/ui/data/DataCard";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import { AIHealthPanel } from "./AIHealthPanel";
import { AIPromptTest } from "./AIPromptTest";
import { AISettingsForm } from "./AISettingsForm";
import { AppearancePanel } from "./AppearancePanel";
import { BillingPanel } from "./BillingPanel";
import { buildChannelStatuses } from "./settings-ops-metrics";
import type { SettingsNavSection } from "./settings-ui";

type Props = {
  section: SettingsNavSection;
  settings: HotelAISettings;
  health: AIHealthStatus;
  logs: AIObservabilityLog[];
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
  logs,
  configured,
  subscription,
  stripeConfigured,
}: Props) {
  const channels = useMemo(
    () => buildChannelStatuses(settings, health),
    [settings, health]
  );

  return (
    <GlassSurface className="min-h-[420px] overflow-hidden p-[var(--ds-surface-padding)] shadow-[var(--shell-shadow-sm)]">
      {renderSection()}
    </GlassSurface>
  );

  function renderSection() {
    switch (section) {
      case "general":
        return <AppearancePanel />;
      case "ai":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <Panel variant="glass" className="p-[var(--ds-surface-padding)]">
                <Section
                  title="AI configuration"
                  subtitle="Prompt, model, temperature, language, and reliability"
                />
                <div className="mt-4">
                  <AISettingsForm settings={settings} configured={configured} />
                </div>
              </Panel>

              <div className="space-y-4">
                <AIHealthPanel health={health} />
                <AIPromptTest />
              </div>
            </div>

            {logs.length > 0 ? (
              <Panel variant="glass" className="p-[var(--ds-surface-padding)]">
                <Section title="Observability log" subtitle="Recent AI events" />
                <ul
                  className="mt-4 max-h-64 space-y-2 overflow-y-auto text-[13px]"
                  role="list"
                >
                  {logs.map((log) => (
                    <li
                      key={log.id}
                      role="listitem"
                      className="flex justify-between gap-4 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-2"
                    >
                      <span className="text-[var(--shell-text)]">
                        <span className="text-[var(--shell-muted)]">
                          [{log.level}]
                        </span>{" "}
                        {log.event}
                      </span>
                      <span className="shrink-0 text-[11px] text-[var(--shell-muted)]">
                        {new Date(log.created_at).toLocaleString("ru-RU")}
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
            ) : null}
          </div>
        );
      case "channels":
        return (
          <Panel variant="glass" className="p-[var(--ds-surface-padding)]">
            <Section
              title="Channels"
              subtitle="Website, Telegram, and future channel connections"
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
                        {channel.connected ? "Connected" : "Pending"}
                      </Badge>
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)]">
                        <Icon size={18} aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] text-[var(--shell-muted)]">
                          Health: {channel.connected ? "Healthy" : "Needs setup"}
                        </p>
                        <p className="mt-1 text-[12px] text-[var(--shell-text)]">
                          Configuration managed in environment and AI settings.
                        </p>
                      </div>
                    </div>
                  </DataCard>
                );
              })}
            </div>
          </Panel>
        );
      case "knowledge":
        return (
          <Panel variant="glass" className="p-[var(--ds-surface-padding)]">
            <Section title="Knowledge base" subtitle="Articles for AI reception" />
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--shell-muted)]">
              Manage articles, categories, and indexing in the dedicated knowledge
              workspace.
            </p>
            <Link
              href="/knowledge"
              className="mt-4 inline-flex items-center gap-2 rounded-[var(--ds-radius-sm)] bg-emerald-600 px-4 py-2 text-[13px] font-medium text-white transition-[background-color] duration-[var(--ds-duration)] hover:bg-emerald-500"
            >
              <BookOpen size={15} aria-hidden />
              Open knowledge workspace
            </Link>
          </Panel>
        );
      case "billing":
        return (
          <div className="space-y-4">
            <Panel variant="glass" className="p-[var(--ds-surface-padding)]">
              <Section
                title="Billing"
                subtitle="Subscription, usage, invoices, payments, plan, and limits"
              />
              <div className="mt-4">
                <BillingPanel
                  subscription={subscription}
                  stripeConfigured={stripeConfigured}
                  health={health}
                />
              </div>
            </Panel>
          </div>
        );
      case "team":
        return (
          <PlaceholderPanel title="Team" subtitle="Members and roles" />
        );
      case "security":
        return (
          <PlaceholderPanel
            title="Security"
            subtitle="Access control and audit"
            icon={<Lock size={18} />}
          />
        );
      case "integrations":
        return (
          <PlaceholderPanel
            title="Integrations"
            subtitle="External services and API connections"
          />
        );
      case "advanced":
        return (
          <div className="space-y-4">
            <PlaceholderPanel
              title="Advanced"
              subtitle="Developer and experimental controls"
            />
            <Panel variant="glass" className="p-[var(--ds-surface-padding)]">
              <Section title="Knowledge workspace" subtitle="Linked module" />
              <p className="mt-3 text-[13px] text-[var(--shell-muted)]">
                Knowledge indexing quality affects AI answer accuracy.
              </p>
              <Link
                href="/knowledge"
                className="mt-4 inline-flex items-center gap-2 rounded-[var(--ds-radius-sm)] border border-[var(--shell-border)] px-4 py-2 text-[13px] font-medium text-[var(--shell-text)] transition-[background-color] duration-[var(--ds-duration)] hover:bg-[var(--shell-surface-raised)]"
              >
                <BookOpen size={15} aria-hidden />
                Open knowledge
              </Link>
            </Panel>
          </div>
        );
      default:
        return null;
    }
  }
}

function PlaceholderPanel({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon?: ReactNode;
}) {
  return (
    <Panel variant="glass" className="p-[var(--ds-surface-padding)]">
      <Section title={title} subtitle={subtitle} />
      <div className="mt-4 flex items-center gap-3 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-4 py-6">
        {icon}
        <p className="text-[13px] text-[var(--shell-muted)]">
          This section is under development. Extended configuration will appear
          here soon.
        </p>
      </div>
    </Panel>
  );
}
