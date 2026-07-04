import type { Metadata } from "next";

import { FeaturesOverview } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Возможности",
  description: "Обзор возможностей Monavel: AI-ресепшн, каналы, PMS и аналитика.",
};

export default function FeaturesPage() {
  return <FeaturesOverview />;
}
