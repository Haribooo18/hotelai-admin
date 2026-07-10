import type { Metadata } from "next";

import { ContactPage } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Monavel about demos, sales, partnerships, and general inquiries.",
};

export default function ContactRoutePage() {
  return <ContactPage />;
}
