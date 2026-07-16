import { IntegrationsPage } from "@/components/marketing";
import { generateMarketingMetadata } from "@/lib/marketing/metadata";

export function generateMetadata() {
  return generateMarketingMetadata("integrations");
}

export default function IntegrationsRoutePage() {
  return <IntegrationsPage />;
}
