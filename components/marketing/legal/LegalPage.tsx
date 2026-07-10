import { LegalLayout } from "@/components/marketing/legal/LegalLayout";
import { LegalPageHeader } from "@/components/marketing/legal/LegalPageHeader";
import { LegalSection } from "@/components/marketing/legal/LegalSection";
import type { LegalDocument } from "@/lib/marketing/legal";
import { LEGAL_CONTACT_EMAIL } from "@/lib/marketing/legal";

type Props = {
  document: LegalDocument;
};

export function LegalPage({ document }: Props) {
  return (
    <LegalLayout sections={document.sections}>
      <article className="mkt-legal-article">
        <LegalPageHeader
          title={document.title}
          description={document.description}
          lastUpdated={document.lastUpdated}
        />

        <div className="mkt-legal-article-sections">
          {document.sections.map((section) => (
            <LegalSection
              key={section.id}
              section={section}
              contactEmail={
                section.id === "contact" ? LEGAL_CONTACT_EMAIL : undefined
              }
            />
          ))}
        </div>
      </article>
    </LegalLayout>
  );
}
