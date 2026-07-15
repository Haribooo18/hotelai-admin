import { DocsLayout } from "@/components/marketing/docs/DocsLayout";
import { DocsNextSteps } from "@/components/marketing/docs/DocsNextSteps";
import { DocsPageHeader } from "@/components/marketing/docs/DocsPageHeader";
import { DocsTableOfContents } from "@/components/marketing/docs/DocsTableOfContents";
import type { DocsArticle } from "@/lib/marketing/docs";

type Props = {
  article: DocsArticle;
};

export function DocsArticlePage({ article }: Props) {
  return (
    <DocsLayout
      activeHref={article.path}
      toc={<DocsTableOfContents sections={article.sections} />}
    >
      <article className="mkt-docs-article">
        <DocsPageHeader title={article.title} description={article.description} />

        <div className="mkt-docs-article-sections">
          {article.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="mkt-docs-article-section"
              aria-labelledby={`${section.id}-heading`}
            >
              <h2 id={`${section.id}-heading`} className="mkt-docs-section-title">
                {section.title}
              </h2>
              <p className="mkt-docs-section-body">{section.body}</p>
            </section>
          ))}
        </div>

        <DocsNextSteps steps={article.nextSteps} />
      </article>
    </DocsLayout>
  );
}
