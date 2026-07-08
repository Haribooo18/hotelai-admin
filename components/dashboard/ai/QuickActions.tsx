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
import { localizeErrorWithT, useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();
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
        toast.error(
          localizeErrorWithT(
            t,
            error instanceof Error ? error.message : t("ai.actionFailed")
          )
        );
      }
    });
  }

  function handleAIRespond() {
    onAIStreamStart?.();

    startTransition(async () => {
      try {
        await streamAIConversation(conversation.id);
        router.refresh();
        toast.success(t("ai.aiResponded"));
      } catch (error) {
        console.error(error);
        toast.error(
          localizeErrorWithT(
            t,
            error instanceof Error ? error.message : t("ai.aiResponseFailed")
          )
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
            label: t("ai.aiReply"),
            icon: Bot,
            onClick: handleAIRespond,
          },
        ]
      : []),
    {
      key: "assign",
      label: t("ai.assignLabel"),
      icon: UserCheck,
      onClick: () =>
        run(
          () =>
            assignConversation({
              conversation_id: conversation.id,
              user_id: currentUserId,
            }),
          t("ai.conversationAssigned")
        ),
    },
    {
      key: "escalate",
      label: t("ai.escalate"),
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
        }, t("ai.conversationEscalated")),
    },
    {
      key: "resolve",
      label: t("ai.resolveLabel"),
      icon: CheckCircle,
      onClick: () =>
        run(
          () =>
            updateConversationStatus({
              id: conversation.id,
              status: "resolved",
            }),
          t("ai.conversationResolved")
        ),
      disabled: conversation.status === "resolved",
    },
    {
      key: "priority",
      label: t("ai.priorityLabel"),
      icon: Star,
      onClick: () =>
        run(
          () =>
            updateConversationPriority({
              id: conversation.id,
              priority: "high",
            }),
          t("ai.priorityRaised")
        ),
    },
    {
      key: "archive",
      label: t("ai.archiveLabel"),
      icon: Archive,
      onClick: () =>
        run(() => archiveConversation(conversation.id), t("ai.conversationArchived")),
    },
  ].filter((action) => !("hidden" in action && action.hidden));

  return (
    <Inline
      gap="sm"
      wrap
      role="toolbar"
      aria-label={t("ai.quickActionsAria")}
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
