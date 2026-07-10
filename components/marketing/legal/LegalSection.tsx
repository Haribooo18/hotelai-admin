import Link from "next/link";

import type { LegalSection as LegalSectionType } from "@/lib/marketing/legal";

type Props = {
  section: LegalSectionType;
  contactEmail?: string;
};

export function LegalSection({ section, contactEmail }: Props) {
  return (
    <section
      id={section.id}
      className="mkt-legal-section"
      aria-labelledby={`${section.id}-heading`}
    >
      <h2 id={`${section.id}-heading`} className="mkt-legal-section-title">
        {section.title}
      </h2>
      <div className="mkt-legal-section-body">
        {section.paragraphs.map((paragraph, index) => {
          const isEmailLine =
            contactEmail !== undefined && paragraph.startsWith("Email:");

          if (isEmailLine) {
            return (
              <p key={`${section.id}-${index}`}>
                Email:{" "}
                <Link href={`mailto:${contactEmail}`} className="mkt-legal-link">
                  {contactEmail}
                </Link>
              </p>
            );
          }

          return <p key={`${section.id}-${index}`}>{paragraph}</p>;
        })}
      </div>
    </section>
  );
}
