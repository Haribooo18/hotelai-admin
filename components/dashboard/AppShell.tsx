"use client";

import type { ReactNode } from "react";

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
    <div className="min-h-screen bg-[var(--shell-bg)] font-sans text-[var(--shell-text)]">
      <div className="flex min-h-screen gap-4 p-3 lg:gap-5 lg:p-5">
        <Sidebar hotel={hotel} />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[20px] border border-[var(--shell-border)] bg-[var(--shell-content)] shadow-[var(--shell-shadow-sm)]">
          <TopBar />
          <PageContainer>{children}</PageContainer>
        </div>
      </div>
    </div>
  );
}
