import { AppShell } from "@/components/dashboard/AppShell";
import { KnowledgePage } from "@/components/dashboard/knowledge";
import {
  getKnowledgeArticles,
  getKnowledgeCategories,
} from "@/lib/services/knowledge.service";
import { getCurrentHotel } from "@/lib/tenant";

export default async function KnowledgeRoute() {
  const [hotel, articles, categories] = await Promise.all([
    getCurrentHotel(),
    getKnowledgeArticles(),
    getKnowledgeCategories(),
  ]);

  return (
    <AppShell hotel={hotel}>
      <KnowledgePage articles={articles} categories={categories} />
    </AppShell>
  );
}
