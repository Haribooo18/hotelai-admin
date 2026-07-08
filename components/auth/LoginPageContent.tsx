"use client";

import { Hotel } from "lucide-react";

import { I18nProvider, useI18n } from "@/lib/i18n";

import { LoginForm } from "./LoginForm";

type Props = {
  redirectedFrom?: string;
};

function LoginPageInner({ redirectedFrom }: Props) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--shell-surface)] p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--ds-radius)] bg-emerald-600">
            <Hotel className="h-6 w-6 text-white" />
          </div>

          <h1 className="text-2xl font-bold">Monavel</h1>

          <p className="mt-2 text-sm text-[var(--shell-muted)]">{t("login.subtitle")}</p>
        </div>

        <div className="rounded-[var(--ds-radius)] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] p-6">
          <LoginForm redirectedFrom={redirectedFrom} />
        </div>
      </div>
    </div>
  );
}

export function LoginPageContent({ redirectedFrom }: Props) {
  return (
    <I18nProvider>
      <LoginPageInner redirectedFrom={redirectedFrom} />
    </I18nProvider>
  );
}
