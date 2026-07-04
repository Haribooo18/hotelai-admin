import { MarketingShell } from "@/components/marketing";
import { marketingMetadata } from "@/lib/marketing/metadata";

export const metadata = marketingMetadata;

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketingShell>{children}</MarketingShell>;
}
