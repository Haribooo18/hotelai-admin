"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { sendMessage } from "@/lib/services/ai.mutations";
import { sendMessageSchema } from "@/lib/validations/ai";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  conversationId: string;
  onSent?: () => void;
};

export function MessageComposer({ conversationId, onSent }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [body, setBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = sendMessageSchema.safeParse({
      conversation_id: conversationId,
      body,
      is_internal: isInternal,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Ошибка");
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
          err instanceof Error ? err.message : "Не удалось отправить"
        );
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-zinc-800 bg-zinc-950 p-4"
      noValidate
    >
      <label htmlFor="message-body" className="sr-only">
        Сообщение
      </label>

      <Textarea
        id="message-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={
          isInternal ? "Внутренняя заметка (не видна гостю)…" : "Сообщение гостю…"
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

      <div className="mt-3 flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-zinc-400">
          <input
            type="checkbox"
            checked={isInternal}
            onChange={(e) => setIsInternal(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-700 accent-emerald-600"
          />
          Внутренняя заметка
        </label>

        <Button type="submit" disabled={pending || !body.trim()}>
          <Send className="mr-2 h-4 w-4" />
          {pending ? "Отправка…" : "Отправить"}
        </Button>
      </div>
    </form>
  );
}
