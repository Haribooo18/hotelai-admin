"use client";

import { I18nProvider, useI18n } from "@/lib/i18n";

import { MonavelHorizontal } from "@/components/brand";

import { LoginForm } from "./LoginForm";

type Props = {
  redirectedFrom?: string;
};

function LoginPageInner({ redirectedFrom }: Props) {
  const { t } = useI18n();

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[var(--shell-surface)] px-5 py-12 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_18%,rgba(217,170,83,0.08),transparent_30%),radial-gradient(circle_at_50%_72%,rgba(35,180,130,0.05),transparent_34%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="w-full max-w-[30rem]">
        <header className="mb-10 flex flex-col items-center text-center">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 scale-[1.8] rounded-full bg-[radial-gradient(circle,rgba(217,170,83,0.08),transparent_68%)] blur-xl"
            />

            <MonavelHorizontal className="mkt-logo-horizontal--auth" />
          </div>

          <h1 className="mt-6 max-w-sm text-balance text-lg font-medium tracking-[-0.015em] text-[var(--shell-text)]">
            {t("login.subtitle")}
          </h1>
        </header>

        <section
          aria-label="Sign in"
          className="relative overflow-hidden rounded-[calc(var(--ds-radius)+6px)] border border-white/[0.08] bg-[var(--shell-surface-raised)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.025)] sm:p-8"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
          />

          <LoginForm redirectedFrom={redirectedFrom} />
        </section>
      </div>
    </main>
  );
}

export function LoginPageContent({ redirectedFrom }: Props) {
  return (
    <I18nProvider>
      <LoginPageInner redirectedFrom={redirectedFrom} />
    </I18nProvider>
  );
}