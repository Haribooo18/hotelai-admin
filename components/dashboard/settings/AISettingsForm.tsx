"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { HotelAISettings } from "@/types/ai-settings";
import type { AIModelId } from "@/lib/ai/models";

import { AI_MODELS, AI_MODEL_IDS } from "@/lib/ai/models";
import { updateHotelAISettings } from "@/lib/services/ai-settings.mutations";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const TOOL_CHOICE_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "none", label: "No tools" },
  { value: "required", label: "Required" },
] as const;

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

  const modelOptions = AI_MODEL_IDS.map((id) => ({
    value: id,
    label: AI_MODELS[id].label,
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
        toast.success("AI settings saved");
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to save"
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
          OPENAI_API_KEY is not set on the server. AI will be unavailable until the
          environment variable is configured.
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
        Enable AI receptionist
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="ai-model" className="block text-sm text-zinc-400">
            Model
          </label>
          <Select
            id="ai-model"
            value={model}
            onChange={setModel}
            options={modelOptions}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="ai-tokens" className="block text-sm text-zinc-400">
            Max output tokens
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
          <label htmlFor="ai-top-p" className="block text-sm text-zinc-400">
            Top P
          </label>
          <Input
            id="ai-top-p"
            type="number"
            step="0.05"
            min="0"
            max="1"
            value={topP}
            onChange={(e) => setTopP(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="ai-tool-choice" className="block text-sm text-zinc-400">
            Tool choice
          </label>
          <Select
            id="ai-tool-choice"
            value={toolChoice}
            onChange={(value) =>
              setToolChoice(value as HotelAISettings["tool_choice"])
            }
            options={TOOL_CHOICE_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="ai-lang" className="block text-sm text-zinc-400">
            System language
          </label>
          <Input
            id="ai-lang"
            value={systemLanguage}
            onChange={(e) => setSystemLanguage(e.target.value)}
            placeholder="ru"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="ai-rate" className="block text-sm text-zinc-400">
            Rate limit / min
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
            Timeout (ms)
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
            Max tool rounds
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
            Retries on error
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
          Additional instructions
        </label>
        <Textarea
          id="ai-extra"
          value={extraInstructions}
          onChange={(e) => setExtraInstructions(e.target.value)}
          placeholder="Special rules for your hotel…"
          className="min-h-24"
        />
      </div>

      <Button type="submit" disabled={pending || !configured}>
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
