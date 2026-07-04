"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { HotelAISettings } from "@/types/ai-settings";

import { AI_MODELS } from "@/lib/validations/ai-settings";
import { updateHotelAISettings } from "@/lib/services/ai-settings.mutations";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  settings: HotelAISettings;
  configured: boolean;
};

export function AISettingsForm({ settings, configured }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [enabled, setEnabled] = useState(settings.enabled);
  const [model, setModel] = useState(settings.model);
  const [maxOutputTokens, setMaxOutputTokens] = useState(
    String(settings.max_output_tokens)
  );
  const [temperature, setTemperature] = useState(String(settings.temperature));
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

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        await updateHotelAISettings({
          enabled,
          model: model as (typeof AI_MODELS)[number],
          max_output_tokens: Number(maxOutputTokens),
          temperature: Number(temperature),
          rate_limit_per_minute: Number(rateLimit),
          timeout_ms: Number(timeoutMs),
          max_tool_rounds: Number(maxToolRounds),
          max_retries: Number(maxRetries),
          extra_instructions: extraInstructions,
        });
        toast.success("Настройки AI сохранены");
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Не удалось сохранить"
        );
      }
    });
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {!configured && (
        <div
          className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4 text-sm text-amber-200"
          role="alert"
        >
          OPENAI_API_KEY не задан на сервере. AI будет недоступен до настройки
          переменной окружения.
        </div>
      )}

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          disabled={!configured}
          className="h-4 w-4 rounded border-zinc-700 accent-emerald-600"
        />
        Включить AI-ресепшн
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="ai-model" className="block text-sm text-zinc-400">
            Модель
          </label>
          <Select
            id="ai-model"
            value={model}
            onChange={setModel}
            options={AI_MODELS.map((m) => ({ value: m, label: m }))}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="ai-tokens" className="block text-sm text-zinc-400">
            Макс. токенов ответа
          </label>
          <Input
            id="ai-tokens"
            type="number"
            value={maxOutputTokens}
            onChange={(e) => setMaxOutputTokens(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="ai-temp" className="block text-sm text-zinc-400">
            Temperature
          </label>
          <Input
            id="ai-temp"
            type="number"
            step="0.1"
            min="0"
            max="2"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="ai-rate" className="block text-sm text-zinc-400">
            Лимит запросов / мин
          </label>
          <Input
            id="ai-rate"
            type="number"
            value={rateLimit}
            onChange={(e) => setRateLimit(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="ai-timeout" className="block text-sm text-zinc-400">
            Таймаут (мс)
          </label>
          <Input
            id="ai-timeout"
            type="number"
            value={timeoutMs}
            onChange={(e) => setTimeoutMs(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="ai-rounds" className="block text-sm text-zinc-400">
            Макс. раундов инструментов
          </label>
          <Input
            id="ai-rounds"
            type="number"
            value={maxToolRounds}
            onChange={(e) => setMaxToolRounds(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="ai-retries" className="block text-sm text-zinc-400">
            Повторы при ошибке
          </label>
          <Input
            id="ai-retries"
            type="number"
            value={maxRetries}
            onChange={(e) => setMaxRetries(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="ai-extra" className="block text-sm text-zinc-400">
          Дополнительные инструкции
        </label>
        <Textarea
          id="ai-extra"
          value={extraInstructions}
          onChange={(e) => setExtraInstructions(e.target.value)}
          placeholder="Особые правила для вашего отеля…"
          className="min-h-24"
        />
      </div>

      <Button type="submit" disabled={pending || !configured}>
        {pending ? "Сохранение…" : "Сохранить настройки"}
      </Button>
    </form>
  );
}
