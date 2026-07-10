import { SecurityPage } from "@/components/marketing";
import { generateMarketingMetadata } from "@/lib/marketing/metadata";

export function generateMetadata() {
  return generateMarketingMetadata("security");
}

export default function SecurityRoutePage() {
  return <SecurityPage />;
}
