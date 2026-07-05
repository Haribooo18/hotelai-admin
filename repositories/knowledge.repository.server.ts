import { createServerRepositoryContext } from "./context.server";
import { KnowledgeRepository } from "./knowledge.repository";

import type { RepositoryContext } from "./context.types";

export async function createKnowledgeRepository(
  context?: RepositoryContext
): Promise<KnowledgeRepository> {
  return new KnowledgeRepository(context ?? (await createServerRepositoryContext()));
}
