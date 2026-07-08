"use client";

import { KnowledgeError } from "@/components/dashboard/knowledge";
import { RouteI18nShell } from "@/components/dashboard/RouteI18nShell";
import { useI18n } from "@/lib/i18n";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

function KnowledgeErrorRouteContent({ error, reset }: Props) {
  const { t } = useI18n();

  return (
    <KnowledgeError
      message={error.message || t("knowledge.loadError")}
      reset={reset}
    />
  );
}

export default function KnowledgeErrorRoute(props: Props) {
  return (
    <RouteI18nShell>
      <KnowledgeErrorRouteContent {...props} />
    </RouteI18nShell>
  );
}
