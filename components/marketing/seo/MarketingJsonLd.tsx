import type { JsonLdNode } from "@/lib/marketing/jsonld";

type Props = {
  data: JsonLdNode | readonly JsonLdNode[];
};

export function MarketingJsonLd({ data }: Props) {
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
