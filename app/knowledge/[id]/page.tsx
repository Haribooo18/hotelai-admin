import { notFound } from "next/navigation";

import { AppShell } from "@/components/dashboard/AppShell";
import { KnowledgeEditor } from "@/components/dashboard/knowledge";
import { createKnowledgeRepository } from "@/repositories/knowledge.repository.server";
import { getCurrentHotel, getCurrentUserEmail } from "@/lib/tenant";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function KnowledgeEditorRoute({ params }: Props) {
  const { id } = await params;
  const [hotel, userEmail, article] = await Promise.all([
    getCurrentHotel(),
    getCurrentUserEmail(),
    createKnowledgeRepository().then((repo) => repo.getById(id)),
  ]);

  if (!article) notFound();

  return (
    <AppShell hotel={hotel} userEmail={userEmail}>
      <KnowledgeEditor article={article} />
    </AppShell>
  );
}
