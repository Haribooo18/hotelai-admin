"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { testAIPrompt } from "@/lib/services/ai-completion.service";
import { shellFormLabelClass } from "@/lib/dashboard/design-system";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DashboardGlassPanel,
  DashboardPanelHeader,
} from "@/components/dashboard/home/DashboardPrimitives";

type TestResult = {
  content: string;
  usage: { input_tokens: number; output_tokens: number; total_tokens: number };
  costUsd: number;
  model: string;
  toolRounds: number;
};

export function AIPromptTest() {
  const [pending, startTransition] = useTransition();
  const [guestName, setGuestName] = useState("Тестовый гость");
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
        toast.error(err instanceof Error ? err.message : "Тест не удался");
      }
    });
  }

  return (
    <DashboardGlassPanel className="p-[var(--ds-surface-padding)]">
      <DashboardPanelHeader
        title="Тестирование"
        subtitle="Проверка ответа AI без создания диалога"
        className="mb-4"
      />

      <form onSubmit={handleTest} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="test-guest" className={shellFormLabelClass}>
            Имя гостя
          </label>
          <Input
            id="test-guest"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="test-msg" className={shellFormLabelClass}>
            Сообщение гостя
          </label>
          <Textarea
            id="test-msg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Во сколько заезд?"
            className="min-h-20"
            required
          />
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={pending || !message.trim()}
          loading={pending}
          className="rounded-[var(--ds-radius-sm)] bg-emerald-600 hover:bg-emerald-500"
        >
          Запустить тест
        </Button>
      </form>

      {result ? (
        <div className="mt-5 space-y-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 p-4">
          <p className="whitespace-pre-wrap text-[13px] text-[var(--shell-text)]">
            {result.content}
          </p>
          <p className="text-[11px] text-[var(--shell-muted)]">
            {result.model} · {result.usage.total_tokens} токенов · $
            {result.costUsd.toFixed(6)} · инструменты: {result.toolRounds}
          </p>
        </div>
      ) : null}
    </DashboardGlassPanel>
  );
}
