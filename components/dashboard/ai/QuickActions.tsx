"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
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
};

export function QuickActions({ conversation, currentUserId }: Props) {
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
        toast.error("Не удалось выполнить действие");
      }
    });
  }

  return (
    <div
      className="flex flex-wrap gap-2"
      role="toolbar"
      aria-label="Быстрые действия"
    >
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
            "Диалог назначен вам"
          )
        }
      >
        <UserCheck className="mr-1.5 h-4 w-4" />
        Назначить мне
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
            "Диалог решён"
          )
        }
      >
        <CheckCircle className="mr-1.5 h-4 w-4" />
        Решить
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
            "Приоритет повышен"
          )
        }
      >
        <Star className="mr-1.5 h-4 w-4" />
        Высокий приоритет
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() =>
          run(() => archiveConversation(conversation.id), "Диалог в архиве")
        }
      >
        <Archive className="mr-1.5 h-4 w-4" />
        В архив
      </Button>
    </div>
  );
}
