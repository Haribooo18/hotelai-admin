import { AppShell } from "@/components/dashboard/AppShell";
import { getTenantContext, canManageBilling } from "@/lib/tenant/context";
import { hasProductAccess } from "@/lib/billing/access";
import { getHotelSubscription } from "@/lib/services/billing.service";

type Props = {
  children: React.ReactNode;
};

export default async function ShellLayout({ children }: Props) {
  const tenant = await getTenantContext();
  const subscription = await getHotelSubscription();

  return (
    <AppShell
      hotel={{ id: tenant.hotelId, name: tenant.hotelName }}
      userEmail={tenant.userEmail}
      subscriptionAccess={{
        hasAccess: hasProductAccess(subscription),
        subscription,
        canManage: canManageBilling(tenant.role),
      }}
    >
      {children}
    </AppShell>
  );
}
