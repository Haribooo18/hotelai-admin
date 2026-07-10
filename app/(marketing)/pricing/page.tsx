import type { Metadata } from "next";

import { PricingPage } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Monavel pricing: Starter, Pro, and Enterprise plans with feature comparison, FAQs, and free trial.",
};

export default function PricingRoutePage() {
  return <PricingPage />;
}
