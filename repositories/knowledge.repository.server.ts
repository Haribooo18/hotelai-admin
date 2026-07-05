import type { RepositoryContext } from "./context.types";
import { KnowledgeRepository } from "./knowledge.repository";

export function createKnowledgeRepository(
  context: RepositoryContext
): KnowledgeRepository {
  return new KnowledgeRepository(context);
}
