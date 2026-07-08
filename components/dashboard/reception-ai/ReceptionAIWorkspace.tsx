"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

import { buttonVariants } from "@/components/ui/core/Button";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { Section } from "@/components/ui/primitives/Section";
import { AIPromptTest } from "@/components/dashboard/settings/AIPromptTest";
import { AISettingsForm } from "@/components/dashboard/settings/AISettingsForm";
import { cardPaddingClass, workspaceSurfaceClass } from "@/lib/dashboard/design-system";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import type { AIObservabilityLog, HotelAISettings } from "@/types/ai-settings";

type Props = {
  settings: HotelAISettings;
  logs: AIObservabilityLog[];
  configured: boolean;
};

export function ReceptionAIWorkspace({
  settings,
  logs,
  configured,
}: Props) {
  const { t } = useI18n();

  return (
    <GlassSurface className={workspaceSurfaceClass}>
      <div className="space-y-3">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className={cn("rounded-[var(--ds-radius-sm)]", cardPaddingClass)}>
            <Section
              title={t("settings.aiConfigTitle")}
              subtitle={t("settings.aiConfigSubtitle")}
            />
            <div className="mt-4">
              <AISettingsForm settings={settings} configured={configured} />
            </div>
          </div>

          <div className="space-y-3">
            <AIPromptTest />
            <div className={cn("rounded-[var(--ds-radius-sm)]", cardPaddingClass)}>
              <Section
                title={t("settings.knowledgeTitle")}
                subtitle={t("settings.knowledgeSubtitle")}
              />
              <p className="mt-4 text-[13px] leading-relaxed text-[var(--shell-muted)]">
                {t("settings.knowledgeHint")}
              </p>
              <Link
                href="/knowledge"
                className={cn(buttonVariants(), "mt-4 gap-2")}
              >
                <BookOpen size={15} aria-hidden />
                {t("settings.openKnowledgeWorkspace")}
              </Link>
            </div>
          </div>
        </div>

        {logs.length > 0 ? (
          <div className={cn("rounded-[var(--ds-radius-sm)]", cardPaddingClass)}>
            <Section
              title={t("settings.observabilityLog")}
              subtitle={t("settings.observabilityLogSubtitle")}
            />
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
                    {new Date(log.created_at).toLocaleString("en-US")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </GlassSurface>
  );
}
