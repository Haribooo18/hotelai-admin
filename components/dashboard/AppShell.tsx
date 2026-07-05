"use client";

import type { ReactNode } from "react";

import { I18nProvider } from "@/lib/i18n";

import { PageContainer, Sidebar, TopBar } from "@/components/dashboard/shell";

type Props = {
  children: ReactNode;
  hotel?: {
    id: string;
    name: string;
  };
  userEmail?: string;
};

export function AppShell({ children, hotel, userEmail }: Props) {
  return (
    <I18nProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--ds-radius-sm)] focus:bg-[var(--shell-surface)] focus:px-4 focus:py-2 focus:text-[13px] focus:font-medium focus:text-[var(--shell-text)] focus:shadow-[var(--shell-shadow-md)] focus:outline-none focus:ring-[3px] focus:ring-[var(--shell-accent-ring)]"
      >
        Перейти к содержимому
      </a>
      <div className="h-svh overflow-hidden bg-[var(--shell-bg)] font-sans text-[var(--shell-text)]">
        <Sidebar hotel={hotel} userEmail={userEmail} />

        <div className="flex h-svh min-w-0 flex-col overflow-hidden bg-[var(--shell-content)] lg:pl-[252px]">
          <TopBar />
          <PageContainer>{children}</PageContainer>
        </div>
      </div>
    </I18nProvider>
  );
}
