import { notFound } from "next/navigation";

import { AppShell } from "@/components/dashboard/AppShell";
import { KnowledgeEditor } from "@/components/dashboard/knowledge";
import { getKnowledgeArticle } from "@/lib/services/knowledge.service";
import { getCurrentHotel } from "@/lib/tenant";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function KnowledgeEditorRoute({ params }: Props) {
  const { id } = await params;
  const [hotel, article] = await Promise.all([
    getCurrentHotel(),
    getKnowledgeArticle(id),
  ]);

  if (!article) notFound();

  return (
    <AppShell hotel={hotel}>
      <KnowledgeEditor article={article} />
    </AppShell>
  );
}
