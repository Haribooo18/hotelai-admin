import { FeaturesPage } from "@/components/marketing";
import { generateMarketingMetadata } from "@/lib/marketing/metadata";

export function generateMetadata() {
  return generateMarketingMetadata("features");
}

export default function FeaturesRoutePage() {
  return <FeaturesPage />;
}
