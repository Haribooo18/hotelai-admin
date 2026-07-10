import type { Metadata } from "next";

import { FeaturesPage } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Monavel platform overview: PMS, AI reception, guest channels, revenue, knowledge, and connected hotel workspaces.",
};

export default function FeaturesRoutePage() {
  return <FeaturesPage />;
}
