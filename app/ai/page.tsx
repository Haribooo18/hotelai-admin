import { Suspense } from "react";

import { AppShell } from "@/components/dashboard/AppShell";
import { AIInboxPage } from "@/components/dashboard/ai";
import { createConversationsRepository } from "@/repositories/conversations.repository.server";
import { createKnowledgeRepository } from "@/repositories/knowledge.repository.server";
import { createSettingsRepository } from "@/repositories/settings.repository.server";
import { getCurrentHotel, requireUser } from "@/lib/tenant";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AIRoute({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const conversationParam = params.conversation;
  const conversationId =
    typeof conversationParam === "string" ? conversationParam : undefined;

  const [hotel, user, conversationsRepo, knowledgeRepo, settingsRepo] =
    await Promise.all([
      getCurrentHotel(),
      requireUser(),
      createConversationsRepository(),
      createKnowledgeRepository(),
      createSettingsRepository(),
    ]);

  const [conversations, articles, aiSettings] = await Promise.all([
    conversationsRepo.getAll(),
    knowledgeRepo.getPublished(),
    settingsRepo.getHotelAISettings(),
  ]);

  let selectedConversation = null;
  let messages: Awaited<ReturnType<typeof conversationsRepo.getMessages>> = [];
  let lead = null;
  let aiActions: Awaited<ReturnType<typeof settingsRepo.getAIActions>> = [];

  if (conversationId) {
    selectedConversation = await conversationsRepo.getById(conversationId);

    if (selectedConversation) {
      [messages, lead, aiActions] = await Promise.all([
        conversationsRepo.getMessages(conversationId),
        selectedConversation.lead_id
          ? conversationsRepo.getLinkedLead(selectedConversation.lead_id)
          : Promise.resolve(null),
        settingsRepo.getAIActions(conversationId),
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
