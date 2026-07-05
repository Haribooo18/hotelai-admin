"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArrowUpRight,
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
import { Button } from "@/components/ui/core/Button";
import { Inline } from "@/components/ui/primitives/Inline";

import { streamAIConversation } from "./ai-stream-client";

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
        await streamAIConversation(conversation.id);
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

  const actions = [
    ...(aiEnabled
      ? [
          {
            key: "ai",
            label: "AI reply",
            icon: Bot,
            onClick: handleAIRespond,
          },
        ]
      : []),
    {
      key: "assign",
      label: "Assign",
      icon: UserCheck,
      onClick: () =>
        run(
          () =>
            assignConversation({
              conversation_id: conversation.id,
              user_id: currentUserId,
            }),
          "Conversation assigned to you"
        ),
    },
    {
      key: "escalate",
      label: "Escalate",
      icon: ArrowUpRight,
      onClick: () =>
        run(async () => {
          await assignConversation({
            conversation_id: conversation.id,
            user_id: currentUserId,
          });
          await updateConversationPriority({
            id: conversation.id,
            priority: "high",
          });
        }, "Conversation escalated"),
    },
    {
      key: "resolve",
      label: "Resolve",
      icon: CheckCircle,
      onClick: () =>
        run(
          () =>
            updateConversationStatus({
              id: conversation.id,
              status: "resolved",
            }),
          "Conversation resolved"
        ),
      disabled: conversation.status === "resolved",
    },
    {
      key: "priority",
      label: "Priority",
      icon: Star,
      onClick: () =>
        run(
          () =>
            updateConversationPriority({
              id: conversation.id,
              priority: "high",
            }),
          "Priority raised"
        ),
    },
    {
      key: "archive",
      label: "Archive",
      icon: Archive,
      onClick: () =>
        run(() => archiveConversation(conversation.id), "Conversation archived"),
    },
  ].filter((action) => !("hidden" in action && action.hidden));

  return (
    <Inline
      gap="sm"
      wrap
      role="toolbar"
      aria-label="Quick actions"
    >
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.key}
            type="button"
            variant="outline"
            size="sm"
            disabled={pending || ("disabled" in action && action.disabled)}
            onClick={action.onClick}
            className="h-8 gap-1.5 bg-[var(--shell-surface-raised)] text-[12px] shadow-[var(--shell-shadow-sm)]"
          >
            <Icon size={14} aria-hidden />
            {action.label}
          </Button>
        );
      })}
    </Inline>
  );
}
