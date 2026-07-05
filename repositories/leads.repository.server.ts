import { createServerRepositoryContext } from "./context.server";
import { LeadsRepository } from "./leads.repository";

import type { RepositoryContext } from "./context.types";

export async function createLeadsRepository(
  context?: RepositoryContext
): Promise<LeadsRepository> {
  return new LeadsRepository(context ?? (await createServerRepositoryContext()));
}
