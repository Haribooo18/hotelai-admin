import { ConversationsRepository } from "./conversations.repository";
import { createServerRepositoryContext } from "./context.server";

import type { RepositoryContext } from "./context.types";

export async function createConversationsRepository(
  context?: RepositoryContext
): Promise<ConversationsRepository> {
  return new ConversationsRepository(
    context ?? (await createServerRepositoryContext())
  );
}

export type { ConversationFilters } from "./conversations.repository";
