import { AppShell } from "@/components/dashboard/AppShell";
import { KnowledgePage } from "@/components/dashboard/knowledge";
import { createKnowledgeRepository } from "@/repositories/knowledge.repository.server";
import { createServerRepositoryContext } from "@/repositories/context.server";
import { getTenantContext } from "@/lib/tenant/context";

export default async function KnowledgeRoute() {
  const tenant = await getTenantContext();
  const repositoryContext = await createServerRepositoryContext(tenant);
  const knowledgeRepo = createKnowledgeRepository(repositoryContext);

  const [articles, categories] = await Promise.all([
    knowledgeRepo.getAll(),
    knowledgeRepo.getCategories(),
  ]);

  return (
    <AppShell
      hotel={{ id: tenant.hotelId, name: tenant.hotelName }}
      userEmail={tenant.userEmail}
    >
      <KnowledgePage articles={articles} categories={categories} />
    </AppShell>
  );
}
