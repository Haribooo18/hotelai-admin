"use client";

import Link from "next/link";

import { RouteErrorFallback } from "@/components/dashboard/shared/RouteErrorFallback";
import { Button, buttonVariants } from "@/components/ui/core/Button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

function GuestProfileErrorActions({ reset }: { reset: () => void }) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button onClick={reset}>{t("common.retry")}</Button>
      <Link href="/guests" className={cn(buttonVariants({ variant: "outline" }))}>
        {t("guests.backToList")}
      </Link>
    </div>
  );
}

export default function GuestProfileError({ error, reset }: Props) {
  return (
    <RouteErrorFallback
      error={error}
      reset={reset}
      titleKey="errors.loadProfile"
      descriptionKey="errors.loadProfileDesc"
      action={<GuestProfileErrorActions reset={reset} />}
    />
  );
}
