"use client";

import { markdownToPreviewHtml } from "@/lib/markdown-preview";

type Props = {
  content: string;
  title?: string;
};

export function KnowledgePreview({ content, title }: Props) {
  const html = markdownToPreviewHtml(content);

  return (
    <article
      className="prose prose-invert max-w-none rounded-lg border border-zinc-800 bg-zinc-950 p-6 text-sm leading-relaxed text-zinc-300"
      aria-label={title ? `Предпросмотр: ${title}` : "Предпросмотр статьи"}
    >
      {title && (
        <h2 className="mb-4 text-xl font-semibold text-zinc-100">{title}</h2>
      )}
      <div
        className="space-y-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-medium [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
