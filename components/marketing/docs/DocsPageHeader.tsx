import { mktOverlineClass, mktSectionSubheadClass } from "@/lib/marketing/design";

type Props = {
  overline?: string;
  title: string;
  description: string;
};

export function DocsPageHeader({ overline, title, description }: Props) {
  return (
    <header className="mkt-docs-page-header">
      {overline ? <p className={mktOverlineClass}>{overline}</p> : null}
      <h1 className="mkt-docs-page-title">{title}</h1>
      <p className={mktSectionSubheadClass}>{description}</p>
    </header>
  );
}
