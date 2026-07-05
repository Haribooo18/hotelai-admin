"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, User } from "lucide-react";
import { toast } from "sonner";

import { sendMessage } from "@/lib/services/ai.mutations";
import { sendGuestMessage } from "@/lib/services/ai-completion.service";
import { sendMessageSchema } from "@/lib/validations/ai";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  conversationId: string;
  aiEnabled?: boolean;
  onSent?: () => void;
  onStreamDelta?: (text: string) => void;
  onStreamEnd?: () => void;
};

export function MessageComposer({
  conversationId,
  aiEnabled = false,
  onSent,
  onStreamDelta,
  onStreamEnd,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [body, setBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [asGuest, setAsGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function streamAIResponse() {
    const res = await fetch("/api/ai/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation_id: conversationId }),
    });

    if (!res.ok || !res.body) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error ?? "AI error");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6).trim();
        if (payload === "[DONE]") continue;
        try {
          const event = JSON.parse(payload) as {
            type: string;
            delta?: string;
            content?: string;
            message?: string;
          };
          if (event.type === "text_delta" && event.delta) {
            accumulated += event.delta;
            onStreamDelta?.(accumulated);
          }
          if (event.type === "text_final" && event.content) {
            accumulated = event.content;
            onStreamDelta?.(accumulated);
          }
          if (event.type === "error") {
            throw new Error(event.message ?? "AI error");
          }
        } catch (e) {
          if (e instanceof SyntaxError) continue;
          throw e;
        }
      }
    }

    onStreamEnd?.();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (asGuest) {
      setError(null);
      const sentBody = body;
      setBody("");

      startTransition(async () => {
        try {
          await sendGuestMessage({
            conversation_id: conversationId,
            body: sentBody,
            trigger_ai: aiEnabled,
          });
          if (aiEnabled) {
            await streamAIResponse();
          }
          router.refresh();
          onSent?.();
        } catch (err) {
          setBody(sentBody);
          toast.error(
            err instanceof Error ? err.message : "Failed to send"
          );
        }
      });
      return;
    }

    const parsed = sendMessageSchema.safeParse({
      conversation_id: conversationId,
      body,
      is_internal: isInternal,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Error");
      return;
    }

    setError(null);
    const sentBody = body;
    setBody("");

    startTransition(async () => {
      try {
        await sendMessage(parsed.data);
        router.refresh();
        onSent?.();
      } catch (err) {
        console.error(err);
        setBody(sentBody);
        toast.error(
          err instanceof Error ? err.message : "Failed to send"
        );
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-[var(--shell-border)] bg-[var(--shell-surface)] p-4"
      noValidate
    >
      <label htmlFor="message-body" className="sr-only">
        Message
      </label>

      <Textarea
        id="message-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={
          asGuest
            ? "Message as guest (test)…"
            : isInternal
              ? "Internal note (not visible to guest)…"
              : "Message to guest…"
        }
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "message-error" : undefined}
        className="min-h-20"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />

      {error && (
        <p id="message-error" className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-[var(--shell-muted)]">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => {
                setIsInternal(e.target.checked);
                if (e.target.checked) setAsGuest(false);
              }}
              disabled={asGuest}
              className="h-4 w-4 rounded border-[var(--shell-border)] accent-emerald-600"
            />
            Internal note
          </label>

          <label className="flex items-center gap-2 text-sm text-[var(--shell-muted)]">
            <input
              type="checkbox"
              checked={asGuest}
              onChange={(e) => {
                setAsGuest(e.target.checked);
                if (e.target.checked) setIsInternal(false);
              }}
              className="h-4 w-4 rounded border-[var(--shell-border)] accent-emerald-600"
            />
            <User size={14} />
            As guest
          </label>
        </div>

        <Button type="submit" disabled={pending || !body.trim()}>
          <Send className="mr-2 h-4 w-4" />
          {pending ? "Sending…" : "Send"}
        </Button>
      </div>
    </form>
  );
}
