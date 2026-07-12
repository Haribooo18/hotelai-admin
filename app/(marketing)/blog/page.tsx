import { BlogComingSoonPage } from "@/components/marketing/blog/BlogComingSoonPage";
import { MarketingJsonLd } from "@/components/marketing/seo/MarketingJsonLd";
import { BLOG_PAGE_CONTENT } from "@/lib/marketing/blog-page";
import { generateCustomMarketingMetadata } from "@/lib/marketing/metadata";

export function generateMetadata() {
  return generateCustomMarketingMetadata({
    id: "blog",
    path: BLOG_PAGE_CONTENT.path,
    title: BLOG_PAGE_CONTENT.title,
    description: BLOG_PAGE_CONTENT.subtitle,
  });
}

export default function BlogPage() {
  return (
    <>
      <MarketingJsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: BLOG_PAGE_CONTENT.title,
          description: BLOG_PAGE_CONTENT.subtitle,
          url: "https://monavel.app/blog",
        }}
      />
      <BlogComingSoonPage />
    </>
  );
}
