import type { Metadata } from "next";

import { IntegrationsPage } from "@/components/marketing/integrations/IntegrationsPage";

export const metadata: Metadata = {
  title: "Integrations | Monavel",
  description:
    "Connect Monavel with the systems your hotel already uses and bring operations, guest communication, and AI into one workspace.",
};

export default function IntegrationsRoute() {
  return <IntegrationsPage />;
}