"use client";

import { useState, useTransition } from "react";
import { toast } from "@/lib/toast";

import { testAIPrompt } from "@/lib/services/ai-completion.service";
import { formSectionClass } from "@/lib/dashboard/design-system";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

import { Button } from "@/components/ui/core/Button";
import { Input } from "@/components/ui/core/Input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/core/FormField";
import { Metric } from "@/components/ui/display/Metric";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";

type TestResult = {
  content: string;
  usage: { input_tokens: number; output_tokens: number; total_tokens: number };
  costUsd: number;
  model: string;
  toolRounds: number;
};

export function AIPromptTest() {
  const { t } = useI18n();
  const [pending, startTransition] = useTransition();
  const [guestName, setGuestName] = useState(() => t("settings.aiTestGuestDefault"));
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<TestResult | null>(null);

  function handleTest(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        const res = await testAIPrompt({
          message,
          guest_name: guestName,
        });
        setResult(res);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("settings.aiTestFailed"));
      }
    });
  }

  return (
    <Panel variant="glass" className="p-[var(--ds-surface-padding)]">
      <Section
        title={t("settings.promptTestTitle")}
        subtitle={t("settings.promptTestSubtitle")}
      />

      <form onSubmit={handleTest} className={cn("mt-4", formSectionClass)}>
        <FormField label={t("settings.promptTestGuestName")} htmlFor="test-guest">
          <Input
            id="test-guest"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
        </FormField>

        <FormField label={t("settings.promptTestGuestMessage")} htmlFor="test-msg">
          <Textarea
            id="test-msg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("settings.promptTestPlaceholder")}
            className="min-h-20"
            required
          />
        </FormField>

        <Button type="submit" size="sm" disabled={pending || !message.trim()} loading={pending}>
          {t("settings.promptTestRun")}
        </Button>
      </form>

      {result ? (
        <div className="mt-5 space-y-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 p-4">
          <p className="whitespace-pre-wrap text-[13px] text-[var(--shell-text)]">
            {result.content}
          </p>
          <p className="text-[11px] text-[var(--shell-muted)]">
            {result.model} ·{" "}
            <Metric value={result.usage.total_tokens} formatter={(v) => `${Math.round(v)} tokens`} /> · $
            {result.costUsd.toFixed(6)} · {t("settings.promptTestTools")}: {result.toolRounds}
          </p>
        </div>
      ) : null}
    </Panel>
  );
}
