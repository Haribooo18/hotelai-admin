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
};

export function AppShell({ children, hotel }: Props) {
  return (
    <I18nProvider>
      <div className="h-svh overflow-hidden bg-[var(--shell-bg)] font-sans text-[var(--shell-text)]">
        <Sidebar hotel={hotel} />

        <div className="flex h-svh min-w-0 flex-col overflow-hidden bg-[var(--shell-content)] lg:pl-[252px]">
          <TopBar />
          <PageContainer>{children}</PageContainer>
        </div>
      </div>
    </I18nProvider>
  );
}
