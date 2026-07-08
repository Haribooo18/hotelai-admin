"use client";

import { Button } from "@/components/ui/core/Button";
import { ErrorState } from "@/components/ui/feedback/ErrorState";
import { useI18n } from "@/lib/i18n";

type Props = {
  message?: string;
  reset?: () => void;
};

export function RevenueError({ message, reset }: Props) {
  const { t } = useI18n();

  return (
    <ErrorState
      title={message ?? t("revenue.loadError")}
      description={t("revenue.loadErrorDesc")}
      action={
        reset ? (
          <Button variant="outline" size="sm" onClick={reset}>
            {t("common.retry")}
          </Button>
        ) : undefined
      }
    />
  );
}
