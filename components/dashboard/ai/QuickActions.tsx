"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  Bot,
  CheckCircle,
  Star,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

import type { Conversation } from "@/types/conversation";

import {
  archiveConversation,
  assignConversation,
  updateConversationPriority,
  updateConversationStatus,
} from "@/lib/services/ai.mutations";

import { Button } from "@/components/ui/button";

type Props = {
  conversation: Conversation;
  currentUserId: string;
  onAIStreamStart?: () => void;
  aiEnabled?: boolean;
};

export function QuickActions({
  conversation,
  currentUserId,
  onAIStreamStart,
  aiEnabled = false,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<void>, success: string) {
    startTransition(async () => {
      try {
        await action();
        toast.success(success);
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to perform action");
      }
    });
  }

  function handleAIRespond() {
    onAIStreamStart?.();
    startTransition(async () => {
      try {
        const res = await fetch("/api/ai/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversation_id: conversation.id }),
        });

        if (!res.ok || !res.body) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            (err as { error?: string }).error ?? "AI error"
          );
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

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
              const event = JSON.parse(payload) as { type: string; message?: string };
              if (event.type === "error") {
                throw new Error(event.message ?? "AI error");
              }
            } catch (e) {
              if (e instanceof SyntaxError) continue;
              throw e;
            }
          }
        }

        router.refresh();
        toast.success("AI responded");
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error ? error.message : "Failed to get AI response"
        );
        router.refresh();
      }
    });
  }

  return (
    <div
      className="flex flex-wrap gap-2"
      role="toolbar"
      aria-label="Quick actions"
    >
      {aiEnabled && (
        <Button
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={handleAIRespond}
        >
          <Bot className="mr-1.5 h-4 w-4" />
          AI reply
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() =>
          run(
            () =>
              assignConversation({
                conversation_id: conversation.id,
                user_id: currentUserId,
              }),
            "Conversation assigned to you"
          )
        }
      >
        <UserCheck className="mr-1.5 h-4 w-4" />
        Assign to me
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={pending || conversation.status === "resolved"}
        onClick={() =>
          run(
            () =>
              updateConversationStatus({
                id: conversation.id,
                status: "resolved",
              }),
            "Conversation resolved"
          )
        }
      >
        <CheckCircle className="mr-1.5 h-4 w-4" />
        Resolve
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() =>
          run(
            () =>
              updateConversationPriority({
                id: conversation.id,
                priority: "high",
              }),
            "Priority raised"
          )
        }
      >
        <Star className="mr-1.5 h-4 w-4" />
        High priority
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() =>
          run(() => archiveConversation(conversation.id), "Conversation archived")
        }
      >
        <Archive className="mr-1.5 h-4 w-4" />
        Archive
      </Button>
    </div>
  );
}
