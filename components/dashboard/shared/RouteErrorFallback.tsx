"use client";

import { useEffect, type ReactNode } from "react";

import { ErrorState } from "@/components/ui/feedback/ErrorState";
import { Button } from "@/components/ui/core/Button";
import { I18nProvider, useI18n } from "@/lib/i18n";
import type { TranslationPath } from "@/lib/i18n/translations";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  titleKey?: TranslationPath;
  description?: string;
  descriptionKey?: TranslationPath;
  action?: ReactNode;
};

function RouteErrorFallbackInner({
  error,
  reset,
  title,
  titleKey,
  description,
  descriptionKey,
  action,
}: Props) {
  const { t } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <ErrorState
        title={title ?? (titleKey ? t(titleKey) : t("errors.genericLoad"))}
        description={
          description ?? (descriptionKey ? t(descriptionKey) : t("errors.genericLoad"))
        }
        action={
          action ?? (
            <Button onClick={reset}>{t("common.retry")}</Button>
          )
        }
        className="max-w-md"
      />
    </div>
  );
}

export function RouteErrorFallback(props: Props) {
  return (
    <I18nProvider>
      <RouteErrorFallbackInner {...props} />
    </I18nProvider>
  );
}
