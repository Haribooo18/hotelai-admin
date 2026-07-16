type Props = {
  title: string;
  description: string;
  lastUpdated: string;
};

export function LegalPageHeader({ title, description, lastUpdated }: Props) {
  return (
    <header className="mkt-legal-page-header">
      <h1 className="mkt-legal-page-title">{title}</h1>
      <p className="mkt-legal-page-description">{description}</p>
      <p className="mkt-legal-page-updated">
        Last updated: <time dateTime={lastUpdated}>{lastUpdated}</time>
      </p>
    </header>
  );
}
