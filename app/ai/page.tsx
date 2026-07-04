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
import { getCurrentHotel, requireUser } from "@/lib/tenant";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AIRoute({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const conversationParam = params.conversation;
  const conversationId =
    typeof conversationParam === "string" ? conversationParam : undefined;

  const [hotel, user, conversations, articles] = await Promise.all([
    getCurrentHotel(),
    requireUser(),
    getConversations(),
    getPublishedKnowledgeArticles(),
  ]);

  let selectedConversation = null;
  let messages: Awaited<ReturnType<typeof getMessages>> = [];
  let lead = null;

  if (conversationId) {
    selectedConversation = await getConversation(conversationId);

    if (selectedConversation) {
      [messages, lead] = await Promise.all([
        getMessages(conversationId),
        selectedConversation.lead_id
          ? getLinkedLead(selectedConversation.lead_id)
          : Promise.resolve(null),
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
        />
      </Suspense>
    </AppShell>
  );
}
