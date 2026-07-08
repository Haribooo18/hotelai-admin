"use client";

import type { ReactNode } from "react";

import { I18nProvider } from "@/lib/i18n";
import {
  shellMainColumnClass,
} from "@/lib/dashboard/design-system";

import {
  PageContainer,
  Sidebar,
  SkipLink,
  TopBar,
} from "@/components/dashboard/shell";

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
      <SkipLink />
      <div className="flex h-svh flex-col overflow-hidden bg-[var(--shell-bg)] font-sans text-[var(--shell-text)]">
        <Sidebar hotel={hotel} userEmail={userEmail} />
        <TopBar />
        <div className={`${shellMainColumnClass} min-h-0 flex-1`}>
          <PageContainer>{children}</PageContainer>
        </div>
      </div>
    </I18nProvider>
  );
}
