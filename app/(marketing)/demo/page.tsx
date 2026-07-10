import type { Metadata } from "next";

import { DemoPage } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "Book a personalized Monavel demo — see hotel operations, AI reception, revenue, and administration in action.",
};

export default function DemoRoutePage() {
  return <DemoPage />;
}
