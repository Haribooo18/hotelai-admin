import { Suspense } from "react";

import { AppShell } from "@/components/dashboard/AppShell";
import { AIInboxPage } from "@/components/dashboard/ai";
import { createConversationsRepository } from "@/repositories/conversations.repository.server";
import { createKnowledgeRepository } from "@/repositories/knowledge.repository.server";
import { createSettingsRepository } from "@/repositories/settings.repository.server";
import { createServerRepositoryContext } from "@/repositories/context.server";
import { getTenantContext } from "@/lib/tenant/context";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AIRoute({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const conversationParam = params.conversation;
  const conversationId =
    typeof conversationParam === "string" ? conversationParam : undefined;

  const tenant = await getTenantContext();
  const repositoryContext = await createServerRepositoryContext(tenant);
  const conversationsRepo = createConversationsRepository(repositoryContext);
  const knowledgeRepo = createKnowledgeRepository(repositoryContext);
  const settingsRepo = createSettingsRepository(repositoryContext);

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
    <AppShell
      hotel={{ id: tenant.hotelId, name: tenant.hotelName }}
      userEmail={tenant.userEmail}
    >
      <Suspense>
        <AIInboxPage
          conversations={conversations}
          articles={articles}
          selectedConversation={selectedConversation}
          messages={messages}
          lead={lead}
          currentUserId={tenant.userId}
          aiActions={aiActions}
          aiEnabled={aiSettings.enabled}
        />
      </Suspense>
    </AppShell>
  );
}
