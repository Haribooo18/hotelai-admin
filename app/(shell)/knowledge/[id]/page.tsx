import { notFound } from "next/navigation";

import { KnowledgeEditor } from "@/components/dashboard/knowledge";
import { createKnowledgeRepository } from "@/repositories/knowledge.repository.server";
import { createServerRepositoryContext } from "@/repositories/context.server";
import { getTenantContext } from "@/lib/tenant/context";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function KnowledgeEditorRoute({ params }: Props) {
  const { id } = await params;
  const tenant = await getTenantContext();
  const repositoryContext = await createServerRepositoryContext(tenant);
  const article = await createKnowledgeRepository(repositoryContext).getById(id);

  if (!article) notFound();

  return <KnowledgeEditor article={article} />;
}
