import type { Metadata } from "next";

import { PricingOverview } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Тарифы",
  description: "Тарифы HotelAI: Starter, Pro и Enterprise.",
};

export default function PricingPage() {
  return <PricingOverview />;
}
