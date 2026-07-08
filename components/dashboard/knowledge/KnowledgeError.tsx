"use client";

import { ErrorState } from "@/components/ui/feedback/ErrorState";
import { Button } from "@/components/ui/core/Button";
import { useI18n } from "@/lib/i18n";

type Props = {
  message?: string;
  onRetry?: () => void;
  reset?: () => void;
};

export function KnowledgeError({ message, onRetry, reset }: Props) {
  const { t } = useI18n();
  const retry = onRetry ?? reset;

  return (
    <ErrorState
      title={message ?? t("knowledge.loadError")}
      description={t("knowledge.loadErrorDesc")}
      action={
        retry ? (
          <Button onClick={retry} variant="outline">
            {t("common.retry")}
          </Button>
        ) : undefined
      }
    />
  );
}
