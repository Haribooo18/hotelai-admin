"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { BillingBlockedScreen } from "./BillingBlockedScreen";
import type { HotelSubscription } from "@/types/subscription";

type Props = {
  hasAccess: boolean;
  subscription: HotelSubscription | null;
  canManage: boolean;
  children: ReactNode;
};

/**
 * usePathname() (a client hook) is what makes the /settings exception
 * possible without introducing middleware.ts just for this — Next.js App
 * Router layouts don't receive the current pathname as a server prop, and
 * this is the one place in the shell layout where that's actually needed:
 * a hotel with a blocked subscription must still be able to reach
 * /settings to fix billing, or they'd have no way out.
 */
export function SubscriptionGate({
  hasAccess,
  subscription,
  canManage,
  children,
}: Props) {
  const pathname = usePathname();
  const isSettingsRoute = pathname?.startsWith("/settings") ?? false;

  if (hasAccess || isSettingsRoute) {
    return <>{children}</>;
  }

  return (
    <BillingBlockedScreen subscription={subscription} canManage={canManage} />
  );
}
