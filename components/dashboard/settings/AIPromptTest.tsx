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
  const [guestName, setGuestName] = useState("Test guest");
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
        toast.error(err instanceof Error ? err.message : "Test failed");
      }
    });
  }

  return (
    <div className="rounded-xl border border-[var(--shell-border)] bg-[var(--shell-surface)] p-5">
      <h3 className="flex items-center gap-2 font-semibold">
        <FlaskConical size={18} className="text-emerald-500" />
        Prompt test
      </h3>
      <p className="mt-1 text-sm text-[var(--shell-muted)]">
        Test AI response without creating a conversation
      </p>

      <form onSubmit={handleTest} className="mt-4 space-y-4">
        <div className="space-y-2">
          <label htmlFor="test-guest" className="block text-sm text-[var(--shell-muted)]">
            Guest name
          </label>
          <Input
            id="test-guest"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="test-msg" className="block text-sm text-[var(--shell-muted)]">
            Guest message
          </label>
          <Textarea
            id="test-msg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What time is check-in?"
            className="min-h-20"
            required
          />
        </div>

        <Button type="submit" disabled={pending || !message.trim()}>
          {pending ? "Generating…" : "Run test"}
        </Button>
      </form>

      {result && (
        <div className="mt-6 space-y-3 rounded-lg border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] p-4">
          <p className="whitespace-pre-wrap text-sm text-[var(--shell-text)]">
            {result.content}
          </p>
          <p className="text-xs text-[var(--shell-muted)]">
            {result.model} · {result.usage.total_tokens} tokens · $
            {result.costUsd.toFixed(6)} · tools: {result.toolRounds}
          </p>
        </div>
      )}
    </div>
  );
}
