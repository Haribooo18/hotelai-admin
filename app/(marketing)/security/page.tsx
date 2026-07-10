import type { Metadata } from "next";

import { SecurityPage } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Security",
  description:
    "How Monavel protects hotel data with tenant isolation, access control, and secure cloud infrastructure.",
};

export default function SecurityRoutePage() {
  return <SecurityPage />;
}
