"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { HotelAISettings } from "@/types/ai-settings";
import type { AIModelId } from "@/lib/ai/models";

import { AI_MODELS, AI_MODEL_IDS } from "@/lib/ai/models";
import { updateHotelAISettings } from "@/lib/services/ai-settings.mutations";
import { formStackClass } from "@/lib/dashboard/design-system";
import { ADMIN_LOCALES, LOCALE_LABELS, useI18n } from "@/lib/i18n";

import { Button } from "@/components/ui/core/Button";
import { Input } from "@/components/ui/core/Input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  FormCheckboxField,
  FormField,
} from "@/components/ui/core/FormField";
import { Section } from "@/components/ui/primitives/Section";

type Props = {
  settings: HotelAISettings;
  configured: boolean;
};

export function AISettingsForm({ settings, configured }: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const [pending, startTransition] = useTransition();

  const [enabled, setEnabled] = useState(settings.enabled);
  const [model, setModel] = useState(settings.model);
  const [maxOutputTokens, setMaxOutputTokens] = useState(
    String(settings.max_output_tokens)
  );
  const [temperature, setTemperature] = useState(String(settings.temperature));
  const [topP, setTopP] = useState(String(settings.top_p ?? 1));
  const [toolChoice, setToolChoice] = useState(settings.tool_choice ?? "auto");
  const [systemLanguage, setSystemLanguage] = useState(
    settings.system_language ?? "ru"
  );
  const [rateLimit, setRateLimit] = useState(
    String(settings.rate_limit_per_minute)
  );
  const [timeoutMs, setTimeoutMs] = useState(String(settings.timeout_ms));
  const [maxToolRounds, setMaxToolRounds] = useState(
    String(settings.max_tool_rounds)
  );
  const [maxRetries, setMaxRetries] = useState(String(settings.max_retries));
  const [extraInstructions, setExtraInstructions] = useState(
    settings.extra_instructions ?? ""
  );

  const toolChoiceOptions = [
    { value: "auto", label: t("settings.aiFormToolChoiceAuto") },
    { value: "none", label: t("settings.aiFormToolChoiceNone") },
    { value: "required", label: t("settings.aiFormToolChoiceRequired") },
  ] as const;

  const modelOptions = AI_MODEL_IDS.map((id) => ({
    value: id,
    label: AI_MODELS[id].label,
  }));

  const languageOptions = ADMIN_LOCALES.map((code) => ({
    value: code,
    label: LOCALE_LABELS[code],
  }));

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        await updateHotelAISettings({
          enabled,
          model: model as AIModelId,
          max_output_tokens: Number(maxOutputTokens),
          temperature: Number(temperature),
          top_p: Number(topP),
          tool_choice: toolChoice,
          system_language: systemLanguage,
          rate_limit_per_minute: Number(rateLimit),
          timeout_ms: Number(timeoutMs),
          max_tool_rounds: Number(maxToolRounds),
          max_retries: Number(maxRetries),
          extra_instructions: extraInstructions,
        });
        toast.success(t("settings.aiFormSaveSuccess"));
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : t("settings.aiFormSaveError")
        );
      }
    });
  }

  return (
    <form onSubmit={handleSave} className={formStackClass}>
      {!configured && (
        <div
          className="rounded-[var(--ds-radius-sm)] border border-amber-900/40 bg-amber-950/20 p-4 text-sm text-amber-200"
          role="alert"
        >
          {t("settings.aiFormOpenaiKeyMissing")}
        </div>
      )}

      <FormCheckboxField
        id="ai-enabled"
        label={t("settings.aiFormEnableAi")}
        checked={enabled}
        onCheckedChange={setEnabled}
        disabled={!configured}
      />

      <section className="space-y-3 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 p-4">
        <Section
          title={t("settings.aiFormPromptTitle")}
          subtitle={t("settings.aiFormPromptSubtitle")}
        />
        <FormField
          label={t("settings.aiFormPersonalityLabel")}
          htmlFor="ai-extra"
        >
          <Textarea
            id="ai-extra"
            value={extraInstructions}
            onChange={(e) => setExtraInstructions(e.target.value)}
            placeholder={t("settings.aiFormPersonalityPlaceholder")}
            className="min-h-28"
          />
        </FormField>
      </section>

      <section className="space-y-4 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 p-4">
        <Section
          title={t("settings.aiFormTempLangTitle")}
          subtitle={t("settings.aiFormTempLangSubtitle")}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={t("settings.aiFormTemperature")} htmlFor="ai-temp">
            <Input
              id="ai-temp"
              type="number"
              step="0.1"
              min="0"
              max="2"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
            />
          </FormField>
          <FormField label={t("settings.aiFormSystemLanguage")} htmlFor="ai-lang">
            <Select
              id="ai-lang"
              value={systemLanguage}
              onChange={setSystemLanguage}
              options={languageOptions}
            />
          </FormField>
        </div>
      </section>

      <section className="space-y-4 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 p-4">
        <Section
          title={t("settings.aiFormModelTitle")}
          subtitle={t("settings.aiFormModelSubtitle")}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("settings.aiFormModel")} htmlFor="ai-model">
            <Select
              id="ai-model"
              value={model}
              onChange={setModel}
              options={modelOptions}
            />
          </FormField>
          <FormField label={t("settings.aiFormMaxTokens")} htmlFor="ai-tokens">
            <Input
              id="ai-tokens"
              type="number"
              value={maxOutputTokens}
              onChange={(e) => setMaxOutputTokens(e.target.value)}
            />
          </FormField>
          <FormField label={t("settings.aiFormTopP")} htmlFor="ai-top-p">
            <Input
              id="ai-top-p"
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={topP}
              onChange={(e) => setTopP(e.target.value)}
            />
          </FormField>
          <FormField label={t("settings.aiFormToolChoice")} htmlFor="ai-tool-choice">
            <Select
              id="ai-tool-choice"
              value={toolChoice}
              onChange={(value) =>
                setToolChoice(value as HotelAISettings["tool_choice"])
              }
              options={toolChoiceOptions.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
            />
          </FormField>
          <FormField label={t("settings.aiFormRateLimit")} htmlFor="ai-rate">
            <Input
              id="ai-rate"
              type="number"
              value={rateLimit}
              onChange={(e) => setRateLimit(e.target.value)}
            />
          </FormField>
          <FormField label={t("settings.aiFormTimeout")} htmlFor="ai-timeout">
            <Input
              id="ai-timeout"
              type="number"
              value={timeoutMs}
              onChange={(e) => setTimeoutMs(e.target.value)}
            />
          </FormField>
          <FormField label={t("settings.aiFormMaxToolRounds")} htmlFor="ai-rounds">
            <Input
              id="ai-rounds"
              type="number"
              value={maxToolRounds}
              onChange={(e) => setMaxToolRounds(e.target.value)}
            />
          </FormField>
          <FormField label={t("settings.aiFormRetries")} htmlFor="ai-retries">
            <Input
              id="ai-retries"
              type="number"
              value={maxRetries}
              onChange={(e) => setMaxRetries(e.target.value)}
            />
          </FormField>
        </div>
      </section>

      <Button
        type="submit"
        disabled={pending || !configured}
        className="rounded-[var(--ds-radius-sm)]"
      >
        {pending ? t("settings.aiFormSaving") : t("settings.aiFormSave")}
      </Button>
    </form>
  );
}
