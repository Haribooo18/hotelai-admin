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
import { SubscriptionGate } from "@/components/dashboard/shell/SubscriptionGate";
import { WorkspaceAiPresenceProvider } from "@/components/dashboard/shared/WorkspaceAiPresence";
import type { HotelSubscription } from "@/types/subscription";

type Props = {
  children: ReactNode;
  hotel?: {
    id: string;
    name: string;
  };
  userEmail?: string;
  subscriptionAccess: {
    hasAccess: boolean;
    subscription: HotelSubscription | null;
    canManage: boolean;
  };
};

export function AppShell({
  children,
  hotel,
  userEmail,
  subscriptionAccess,
}: Props) {
  return (
    <I18nProvider>
      <SkipLink />
      <div className="flex h-svh flex-col overflow-hidden bg-[var(--shell-bg)] font-sans text-[var(--shell-text)]">
      <WorkspaceAiPresenceProvider>
        <Sidebar hotel={hotel} userEmail={userEmail} />
        <TopBar />
        <div className={`${shellMainColumnClass} min-h-0 flex-1`}>
          <PageContainer>
            <SubscriptionGate
              hasAccess={subscriptionAccess.hasAccess}
              subscription={subscriptionAccess.subscription}
              canManage={subscriptionAccess.canManage}
            >
              {children}
            </SubscriptionGate>
          </PageContainer>
        </div>
      </WorkspaceAiPresenceProvider>
      </div>
    </I18nProvider>
  );
}
