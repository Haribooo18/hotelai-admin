import { Suspense } from "react";

import { AppShell } from "@/components/dashboard/AppShell";
import { AIInboxPage } from "@/components/dashboard/ai";
import { createConversationsRepository } from "@/repositories/conversations.repository.server";
import { createKnowledgeRepository } from "@/repositories/knowledge.repository.server";
import { createSettingsRepository } from "@/repositories/settings.repository.server";
import { getCurrentHotel, getCurrentUserEmail, requireUser } from "@/lib/tenant";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AIRoute({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const conversationParam = params.conversation;
  const conversationId =
    typeof conversationParam === "string" ? conversationParam : undefined;

  const [hotel, userEmail, user, conversations, articles, aiSettings] =
    await Promise.all([
      getCurrentHotel(),
      getCurrentUserEmail(),
      requireUser(),
      createConversationsRepository().then((repo) => repo.getAll()),
      createKnowledgeRepository().then((repo) => repo.getPublished()),
      createSettingsRepository().then((repo) => repo.getHotelAISettings()),
    ]);

  let selectedConversation = null;
  let messages: Awaited<
    ReturnType<
      Awaited<ReturnType<typeof createConversationsRepository>>["getMessages"]
    >
  > = [];
  let lead = null;
  let aiActions: Awaited<
    ReturnType<
      Awaited<ReturnType<typeof createSettingsRepository>>["getAIActions"]
    >
  > = [];

  if (conversationId) {
    const conversationsRepo = await createConversationsRepository();
    const settingsRepo = await createSettingsRepository();

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
    <AppShell hotel={hotel} userEmail={userEmail}>
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
