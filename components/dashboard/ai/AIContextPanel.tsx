"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Bot,
  CalendarPlus,
  FileText,
  Mail,
  Phone,
  Sparkles,
  UserCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import type { AIAction } from "@/types/ai-action";
import type { Conversation } from "@/types/conversation";
import type { KnowledgeArticle } from "@/types/knowledge-article";
import type { Lead } from "@/types/lead";
import type { Message } from "@/types/message";

import {
  assignConversation,
  updateConversationStatus,
} from "@/lib/services/ai.mutations";
import { getConversationChannelMeta } from "@/lib/ai/metadata";
import {
  DashboardEmptyState,
  DashboardGlassPanel,
  DashboardPanelHeader,
} from "@/components/dashboard/home/DashboardPrimitives";
import { ConversationReplay } from "@/components/dashboard/settings/ConversationReplay";
import { cn } from "@/lib/utils";

import {
  buildAIAnalysis,
  buildGuestContext,
  getGuestInitials,
  getPromptSources,
  getRelevantArticles,
} from "./ai-ops-metrics";

type Props = {
  conversation: Conversation | null;
  messages: Message[];
  lead: Lead | null;
  articles: KnowledgeArticle[];
  aiActions: AIAction[];
  currentUserId: string;
  aiEnabled: boolean;
  onRegenerate?: () => void;
};

const SENTIMENT_CLASS = {
  positive: "text-emerald-400",
  neutral: "text-[var(--shell-muted)]",
  negative: "text-red-400",
} as const;

export function AIContextPanel({
  conversation,
  messages,
  lead,
  articles,
  aiActions,
  currentUserId,
  onRegenerate,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (!conversation) {
    return (
      <aside className="hidden h-full w-80 shrink-0 flex-col border-l border-[var(--shell-border)]/50 bg-[var(--shell-surface)]/80 backdrop-blur-xl xl:flex">
        <div className="flex flex-1 items-center justify-center p-6">
          <DashboardEmptyState
            title="AI context"
            description="Select a conversation to view guest profile, AI analysis, and knowledge sources."
            icon={<Sparkles size={18} />}
          />
        </div>
      </aside>
    );
  }

  const guest = buildGuestContext(conversation, lead);
  const analysis = buildAIAnalysis(conversation, messages, aiActions);
  const relevantArticles = getRelevantArticles(articles, conversation, messages);
  const promptSources = getPromptSources(aiActions);
  const channelLabel =
    getConversationChannelMeta(conversation.channel)?.label ?? conversation.channel;

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

  return (
    <aside className="hidden h-full w-80 shrink-0 flex-col overflow-hidden border-l border-[var(--shell-border)]/50 bg-[var(--shell-surface)]/80 backdrop-blur-xl xl:flex">
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        <DashboardGlassPanel className="p-3">
          <DashboardPanelHeader
            title="Guest profile"
            subtitle="Reservation and CRM context"
            className="mb-3"
          />

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--shell-accent-muted)] text-[13px] font-semibold text-[var(--shell-accent)]">
              {getGuestInitials(guest.displayName)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-[var(--shell-text)]">
                {guest.displayName}
              </p>
              <p className="text-[11px] text-[var(--shell-muted)]">{channelLabel}</p>
            </div>
          </div>

          <dl className="mt-3 space-y-2 text-[12px]">
            <ContextRow label="Current reservation" value={guest.currentReservation} />
            <ContextRow label="Previous stays" value={String(guest.previousStays)} />
            <ContextRow label="Lifetime revenue" value="$0" />
          </dl>

          {guest.tags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {guest.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--shell-surface-raised)] px-2 py-0.5 text-[10px] font-medium text-[var(--shell-muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {guest.preferences.length > 0 ? (
            <div className="mt-3 space-y-1">
              <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
                Preferences
              </p>
              {guest.preferences.map((preference) => (
                <p key={preference} className="text-[12px] text-[var(--shell-text)]">
                  {preference}
                </p>
              ))}
            </div>
          ) : null}
        </DashboardGlassPanel>

        <DashboardGlassPanel className="p-3">
          <DashboardPanelHeader
            title="AI analysis"
            subtitle="Intent and routing signals"
            className="mb-3"
          />
          <div className="space-y-2 text-[12px]">
            <AnalysisRow label="Intent" value={analysis.intent} />
            <AnalysisRow
              label="Sentiment"
              value={analysis.sentiment}
              valueClass={SENTIMENT_CLASS[analysis.sentiment]}
            />
            <AnalysisRow label="Language" value={analysis.language} />
            <AnalysisRow
              label="Confidence"
              value={`${Math.round(analysis.confidence * 100)}%`}
            />
            <p className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-accent-muted)]/40 px-2.5 py-2 text-[12px] text-[var(--shell-text)]">
              <span className="font-medium">Next best action: </span>
              {analysis.nextBestAction}
            </p>
          </div>
        </DashboardGlassPanel>

        <DashboardGlassPanel className="p-3">
          <DashboardPanelHeader
            title="Knowledge"
            subtitle="Relevant articles and sources"
            className="mb-3"
          />

          {relevantArticles.length === 0 ? (
            <DashboardEmptyState
              title="No matches"
              description="No relevant articles found for this conversation."
            />
          ) : (
            <ul className="space-y-2">
              {relevantArticles.map((article) => (
                <li
                  key={article.id}
                  className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/70 px-2.5 py-2 transition-[background-color] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:bg-[var(--shell-surface-raised)]"
                >
                  <p className="truncate text-[12px] font-medium text-[var(--shell-text)]">
                    {article.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-[var(--shell-muted)]">
                    {article.content}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {promptSources.length > 0 ? (
            <div className="mt-3">
              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
                Prompt sources
              </p>
              <ul className="space-y-1">
                {promptSources.map((source) => (
                  <li
                    key={source}
                    className="flex items-center gap-1.5 text-[11px] text-[var(--shell-muted)]"
                  >
                    <FileText size={12} />
                    {source}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-3">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.06em] text-[var(--shell-muted)]">
              AI replay
            </p>
            <ConversationReplay actions={aiActions} />
          </div>
        </DashboardGlassPanel>

        <DashboardGlassPanel className="p-3">
          <DashboardPanelHeader title="Actions" subtitle="Operational shortcuts" className="mb-3" />
          <div className="grid gap-2">
            {guest.phone ? (
              <ActionButton
                icon={<Phone size={14} />}
                label="Call guest"
                href={`tel:${guest.phone}`}
              />
            ) : null}
            {guest.email ? (
              <ActionButton
                icon={<Mail size={14} />}
                label="Email guest"
                href={`mailto:${guest.email}`}
              />
            ) : null}
            <ActionButton
              icon={<CalendarPlus size={14} />}
              label="Create booking"
              onClick={() => router.push("/bookings")}
            />
            <ActionButton
              icon={<UserCheck size={14} />}
              label="Assign human"
              disabled={pending}
              onClick={() =>
                run(
                  () =>
                    assignConversation({
                      conversation_id: conversation.id,
                      user_id: currentUserId,
                    }),
                  "Conversation assigned"
                )
              }
            />
            <ActionButton
              icon={<XCircle size={14} />}
              label="Close conversation"
              disabled={pending || conversation.status === "resolved"}
              onClick={() =>
                run(
                  () =>
                    updateConversationStatus({
                      id: conversation.id,
                      status: "resolved",
                    }),
                  "Conversation closed"
                )
              }
            />
            {onRegenerate ? (
              <ActionButton
                icon={<Bot size={14} />}
                label="Regenerate AI reply"
                disabled={pending}
                onClick={onRegenerate}
              />
            ) : null}
          </div>
        </DashboardGlassPanel>

        {conversation.internal_notes ? (
          <DashboardGlassPanel className="border border-amber-500/20 p-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-amber-400">
              Internal notes
            </p>
            <p className="mt-2 whitespace-pre-wrap text-[12px] text-[var(--shell-text)]">
              {conversation.internal_notes}
            </p>
          </DashboardGlassPanel>
        ) : null}
      </div>
    </aside>
  );
}

function ContextRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value) return null;

  return (
    <div>
      <dt className="text-[var(--shell-muted)]">{label}</dt>
      <dd className="mt-0.5 text-[var(--shell-text)]">{value}</dd>
    </div>
  );
}

function AnalysisRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[var(--shell-muted)]">{label}</span>
      <span className={cn("font-medium capitalize text-[var(--shell-text)]", valueClass)}>
        {value}
      </span>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  href,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const className =
    "flex h-9 w-full items-center gap-2 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)] px-3 text-[12px] font-medium text-[var(--shell-text)] shadow-[var(--shell-shadow-sm)] transition-[background-color,transform] duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:bg-[var(--shell-nav-hover-bg)] disabled:opacity-50";

  if (href) {
    return (
      <a href={href} className={className}>
        {icon}
        {label}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick} disabled={disabled}>
      {icon}
      {label}
    </button>
  );
}
