import { ConversationsRepository } from "./conversations.repository";

import type { RepositoryContext } from "./context.types";

export function createConversationsRepository(
  context: RepositoryContext
): ConversationsRepository {
  return new ConversationsRepository(context);
}

export type { ConversationFilters } from "./conversations.repository";
