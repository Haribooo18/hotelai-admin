"use client";

import { useState, useTransition } from "react";
import { FlaskConical } from "lucide-react";
import { toast } from "sonner";

import { testAIPrompt } from "@/lib/services/ai-completion.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
        toast.error(err instanceof Error ? err.message : "Ошибка теста");
      }
    });
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
      <h3 className="flex items-center gap-2 font-semibold">
        <FlaskConical size={18} className="text-emerald-500" />
        Тест промпта
      </h3>
      <p className="mt-1 text-sm text-zinc-500">
        Проверка ответа AI без создания диалога
      </p>

      <form onSubmit={handleTest} className="mt-4 space-y-4">
        <div className="space-y-2">
          <label htmlFor="test-guest" className="block text-sm text-zinc-400">
            Имя гостя
          </label>
          <Input
            id="test-guest"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="test-msg" className="block text-sm text-zinc-400">
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

        <Button type="submit" disabled={pending || !message.trim()}>
          {pending ? "Генерация…" : "Запустить тест"}
        </Button>
      </form>

      {result && (
        <div className="mt-6 space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <p className="whitespace-pre-wrap text-sm text-zinc-200">
            {result.content}
          </p>
          <p className="text-xs text-zinc-500">
            {result.model} · {result.usage.total_tokens} токенов · $
            {result.costUsd.toFixed(6)} · инструментов: {result.toolRounds}
          </p>
        </div>
      )}
    </div>
  );
}
