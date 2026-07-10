import type { ReactNode } from "react";

import { AppShell } from "@/components/dashboard/AppShell";
import { MarketingShell } from "@/components/marketing";
import { generateMarketingMetadata } from "@/lib/marketing/metadata";
import { createClient } from "@/lib/supabase/server";
import { getTenantContext } from "@/lib/tenant/context";

export function generateMetadata() {
  return generateMarketingMetadata("ai");
}

type Props = {
  children: ReactNode;
};

export default async function AiRouteLayout({ children }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <MarketingShell>{children}</MarketingShell>;
  }

  const tenant = await getTenantContext();

  return (
    <AppShell
      hotel={{ id: tenant.hotelId, name: tenant.hotelName }}
      userEmail={tenant.userEmail}
    >
      {children}
    </AppShell>
  );
}
