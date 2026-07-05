import { AppShell } from "@/components/dashboard/AppShell";
import { KnowledgePage } from "@/components/dashboard/knowledge";
import { createKnowledgeRepository } from "@/repositories/knowledge.repository.server";
import { getCurrentHotel } from "@/lib/tenant";

export default async function KnowledgeRoute() {
  const [hotel, knowledgeRepo] = await Promise.all([
    getCurrentHotel(),
    createKnowledgeRepository(),
  ]);
  const [articles, categories] = await Promise.all([
    knowledgeRepo.getAll(),
    knowledgeRepo.getCategories(),
  ]);

  return (
    <AppShell hotel={hotel}>
      <KnowledgePage articles={articles} categories={categories} />
    </AppShell>
  );
}
