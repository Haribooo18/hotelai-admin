import type { Metadata } from "next";

import { IntegrationsPage } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Integrations",
  description:
    "Monavel integrations: Website Chat, Telegram, Knowledge Base, and planned guest channels in one workspace.",
};

export default function IntegrationsRoutePage() {
  return <IntegrationsPage />;
}
