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

import {
  DashboardGlassPanel,
  DashboardPanelHeader,
} from "@/components/dashboard/home/DashboardPrimitives";
import { cn } from "@/lib/utils";

import { AIHealthPanel } from "./AIHealthPanel";
import { AIPromptTest } from "./AIPromptTest";
import { AISettingsForm } from "./AISettingsForm";
import { AppearancePanel } from "./AppearancePanel";
import { BillingPanel } from "./BillingPanel";
import {
  buildChannelStatuses,
  buildSettingsOperationsSnapshot,
  type SettingsOperationsSnapshot,
  type SettingsSection,
} from "./settings-ops-metrics";

type Props = {
  section: SettingsSection;
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
  const operations = useMemo(
    () => buildSettingsOperationsSnapshot(health, logs, configured),
    [health, logs, configured]
  );

  return (
    <div className="space-y-4">
      <div className="min-h-[420px]">{renderSection()}</div>
      <SettingsOperations snapshot={operations} />
    </div>
  );

  function renderSection() {
    switch (section) {
      case "general":
        return <AppearancePanel />;
      case "ai":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
                <DashboardPanelHeader
                  title="Настройки AI"
                  subtitle="Промпт, температура, язык и личность"
                  className="mb-4"
                />
                <AISettingsForm settings={settings} configured={configured} />
              </DashboardGlassPanel>

              <div className="space-y-4">
                <AIHealthPanel health={health} />
                <AIPromptTest />
              </div>
            </div>

            {logs.length > 0 ? (
              <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
                <DashboardPanelHeader
                  title="Журнал наблюдаемости"
                  subtitle="Последние события AI"
                  className="mb-4"
                />
                <ul className="max-h-64 space-y-2 overflow-y-auto text-[13px]">
                  {logs.map((log) => (
                    <li
                      key={log.id}
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
              </DashboardGlassPanel>
            ) : null}
          </div>
        );
      case "channels":
        return (
          <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
            <DashboardPanelHeader
              title="Каналы связи"
              subtitle="Подключённые и планируемые каналы"
              className="mb-4"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {channels.map((channel) => {
                const Icon =
                  CHANNEL_ICONS[channel.id as keyof typeof CHANNEL_ICONS] ??
                  Globe;

                return (
                  <div
                    key={channel.id}
                    className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 p-4 transition-[box-shadow,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px hover:shadow-[var(--shell-shadow-sm)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)] text-[var(--shell-accent)]">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-[var(--shell-text)]">
                            {channel.label}
                          </p>
                          <p className="mt-0.5 text-[12px] text-[var(--shell-muted)]">
                            {channel.description}
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          channel.connected
                            ? "bg-emerald-500/12 text-emerald-400"
                            : "bg-[var(--shell-surface-raised)] text-[var(--shell-muted)]"
                        )}
                      >
                        {channel.connected ? "Подключён" : "Ожидает"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </DashboardGlassPanel>
        );
      case "knowledge":
        return (
          <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
            <DashboardPanelHeader
              title="База знаний"
              subtitle="Статьи для AI-ресепшена"
              className="mb-4"
            />
            <p className="text-[13px] leading-relaxed text-[var(--shell-muted)]">
              Управляйте статьями, категориями и индексацией в отдельном разделе.
              Качество базы знаний влияет на точность ответов AI.
            </p>
            <Link
              href="/knowledge"
              className="mt-4 inline-flex items-center gap-2 rounded-[var(--ds-radius-sm)] bg-emerald-600 px-4 py-2 text-[13px] font-medium text-white transition-[background-color] duration-[var(--ds-duration)] hover:bg-emerald-500"
            >
              <BookOpen size={15} />
              Открыть базу знаний
            </Link>
          </DashboardGlassPanel>
        );
      case "billing":
        return (
          <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
            <DashboardPanelHeader
              title="Подписка"
              subtitle="Тариф и платежи"
              className="mb-4"
            />
            <BillingPanel
              subscription={subscription}
              stripeConfigured={stripeConfigured}
            />
          </DashboardGlassPanel>
        );
      case "team":
        return <PlaceholderPanel title="Команда" subtitle="Участники и роли" />;
      case "security":
        return (
          <PlaceholderPanel
            title="Безопасность"
            subtitle="Доступ и аудит"
            icon={<Lock size={18} />}
          />
        );
      case "integrations":
        return (
          <PlaceholderPanel
            title="Интеграции"
            subtitle="Внешние сервисы и API"
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
  icon,
}: {
  title: string;
  subtitle: string;
  icon?: ReactNode;
}) {
  return (
    <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
      <DashboardPanelHeader title={title} subtitle={subtitle} className="mb-4" />
      <div className="flex items-center gap-3 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-4 py-6">
        {icon}
        <p className="text-[13px] text-[var(--shell-muted)]">
          Раздел в разработке. Скоро появится расширенная конфигурация.
        </p>
      </div>
    </DashboardGlassPanel>
  );
}

function SettingsOperations({
  snapshot,
}: {
  snapshot: SettingsOperationsSnapshot;
}) {
  return (
    <div className="space-y-3">
      <DashboardPanelHeader
        title="Операции"
        subtitle="Активность, диагностика и статус системы"
      />

      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        <DashboardGlassPanel className="p-4">
          <p className="text-[13px] font-semibold text-[var(--shell-text)]">
            Недавняя активность
          </p>
          {snapshot.recentActivity.length === 0 ? (
            <p className="mt-3 text-[12px] text-[var(--shell-muted)]">
              Событий пока нет
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {snapshot.recentActivity.map((log) => (
                <li
                  key={log.id}
                  className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-2"
                >
                  <p className="truncate text-[12px] font-medium text-[var(--shell-text)]">
                    {log.event}
                  </p>
                  <p className="text-[11px] text-[var(--shell-muted)]">
                    [{log.level}] ·{" "}
                    {new Date(log.created_at).toLocaleString("ru-RU")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </DashboardGlassPanel>

        <DashboardGlassPanel className="p-4">
          <p className="text-[13px] font-semibold text-[var(--shell-text)]">
            Диагностика системы
          </p>
          <ul className="mt-3 space-y-2">
            {snapshot.diagnostics.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-2 text-[12px]"
              >
                <span className="text-[var(--shell-muted)]">{item.label}</span>
                <span
                  className={cn(
                    "font-medium",
                    item.ok ? "text-emerald-400" : "text-amber-400"
                  )}
                >
                  {item.value}
                </span>
              </li>
            ))}
          </ul>
        </DashboardGlassPanel>

        <DashboardGlassPanel className="p-4">
          <p className="text-[13px] font-semibold text-[var(--shell-text)]">
            Среда и API
          </p>
          <dl className="mt-3 grid gap-2 text-[12px]">
            <OpsRow label="Версия" value={snapshot.version} />
            <OpsRow label="Окружение" value={snapshot.environment} />
            <OpsRow
              label="Статус API"
              value={snapshot.apiOnline ? "Онлайн" : "Офлайн"}
              highlight={snapshot.apiOnline}
            />
          </dl>
        </DashboardGlassPanel>
      </div>
    </div>
  );
}

function OpsRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-3 py-2">
      <span className="text-[var(--shell-muted)]">{label}</span>
      <span
        className={cn(
          "font-medium",
          highlight === undefined
            ? "text-[var(--shell-text)]"
            : highlight
              ? "text-emerald-400"
              : "text-amber-400"
        )}
      >
        {value}
      </span>
    </div>
  );
}
