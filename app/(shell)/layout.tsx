import { AppShell } from "@/components/dashboard/AppShell";
import { getTenantContext } from "@/lib/tenant/context";

type Props = {
  children: React.ReactNode;
};

export default async function ShellLayout({ children }: Props) {
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
