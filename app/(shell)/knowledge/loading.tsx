import { RouteI18nShell } from "@/components/dashboard/RouteI18nShell";
import { KnowledgeRouteLoading } from "@/components/dashboard/knowledge/KnowledgeRouteLoading";

export default function KnowledgeLoadingRoute() {
  return (
    <RouteI18nShell>
      <KnowledgeRouteLoading />
    </RouteI18nShell>
  );
}
