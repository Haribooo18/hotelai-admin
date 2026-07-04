import { Suspense } from "react";

import { AppShell } from "@/components/dashboard/AppShell";
import { AIInboxPage } from "@/components/dashboard/ai";
import {
  getConversation,
  getConversations,
  getLinkedLead,
  getMessages,
} from "@/lib/services/ai.service";
import {
  getPublishedKnowledgeArticles,
} from "@/lib/services/knowledge.service";
import {
  getAIActions,
  getHotelAISettings,
} from "@/lib/services/ai-settings.service";
import { bootstrapAIServices } from "@/lib/ai/bootstrap";
import { getCurrentHotel, requireUser } from "@/lib/tenant";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AIRoute({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const conversationParam = params.conversation;
  const conversationId =
    typeof conversationParam === "string" ? conversationParam : undefined;

  const [hotel, user, conversations, articles, aiSettings] = await Promise.all([
    getCurrentHotel(),
    requireUser(),
    getConversations(),
    getPublishedKnowledgeArticles(),
    getHotelAISettings(),
  ]);

  bootstrapAIServices();

  let selectedConversation = null;
  let messages: Awaited<ReturnType<typeof getMessages>> = [];
  let lead = null;

  let aiActions: Awaited<ReturnType<typeof getAIActions>> = [];

  if (conversationId) {
    selectedConversation = await getConversation(conversationId);

    if (selectedConversation) {
      [messages, lead, aiActions] = await Promise.all([
        getMessages(conversationId),
        selectedConversation.lead_id
          ? getLinkedLead(selectedConversation.lead_id)
          : Promise.resolve(null),
        getAIActions(conversationId),
      ]);
    }
  }

  return (
    <AppShell hotel={hotel}>
      <Suspense>
        <AIInboxPage
          conversations={conversations}
          articles={articles}
          selectedConversation={selectedConversation}
          messages={messages}
          lead={lead}
          currentUserId={user.id}
          aiActions={aiActions}
          aiEnabled={aiSettings.enabled}
        />
      </Suspense>
    </AppShell>
  );
}
