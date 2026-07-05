import { AppShell } from "@/components/dashboard/AppShell";
import { KnowledgePage } from "@/components/dashboard/knowledge";
import { createKnowledgeRepository } from "@/repositories/knowledge.repository.server";
import { getCurrentHotel, getCurrentUserEmail } from "@/lib/tenant";

export default async function KnowledgeRoute() {
  const [hotel, userEmail, knowledgeRepo] = await Promise.all([
    getCurrentHotel(),
    getCurrentUserEmail(),
    createKnowledgeRepository(),
  ]);
  const [articles, categories] = await Promise.all([
    knowledgeRepo.getAll(),
    knowledgeRepo.getCategories(),
  ]);

  return (
    <AppShell hotel={hotel} userEmail={userEmail}>
      <KnowledgePage articles={articles} categories={categories} />
    </AppShell>
  );
}
