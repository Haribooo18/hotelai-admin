import { notFound } from "next/navigation";

import { AppShell } from "@/components/dashboard/AppShell";
import { KnowledgeEditor } from "@/components/dashboard/knowledge";
import { createKnowledgeRepository } from "@/repositories/knowledge.repository.server";
import { getCurrentHotel } from "@/lib/tenant";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function KnowledgeEditorRoute({ params }: Props) {
  const { id } = await params;
  const [hotel, knowledgeRepo] = await Promise.all([
    getCurrentHotel(),
    createKnowledgeRepository(),
  ]);
  const article = await knowledgeRepo.getById(id);

  if (!article) notFound();

  return (
    <AppShell hotel={hotel}>
      <KnowledgeEditor article={article} />
    </AppShell>
  );
}
