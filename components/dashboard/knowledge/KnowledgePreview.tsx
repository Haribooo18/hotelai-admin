"use client";

import { markdownToPreviewHtml } from "@/lib/markdown-preview";
import { formatTranslation, useI18n } from "@/lib/i18n";

type Props = {
  content: string;
  title?: string;
};

export function KnowledgePreview({ content, title }: Props) {
  const { t } = useI18n();
  const html = markdownToPreviewHtml(content);

  const ariaLabel = title
    ? formatTranslation(t("knowledge.previewAriaWithTitle"), { title })
    : t("knowledge.previewAria");

  return (
    <article
      className="prose prose-invert max-w-none rounded-lg border border-[var(--shell-border)] bg-[var(--shell-surface)] p-6 text-sm leading-relaxed text-[var(--shell-text)]"
      aria-label={ariaLabel}
    >
      {title && (
        <h2 className="mb-4 text-xl font-semibold text-[var(--shell-text)]">{title}</h2>
      )}
      <div
        className="space-y-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-medium [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
