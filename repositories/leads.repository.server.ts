import type { RepositoryContext } from "./context.types";
import { LeadsRepository } from "./leads.repository";

export function createLeadsRepository(context: RepositoryContext): LeadsRepository {
  return new LeadsRepository(context);
}
