import { DemoPage } from "@/components/marketing";
import { generateMarketingMetadata } from "@/lib/marketing/metadata";

export function generateMetadata() {
  return generateMarketingMetadata("demo");
}

export default function DemoRoutePage() {
  return <DemoPage />;
}
