import type { DemoPreviewArea } from "@/lib/marketing/demo-page";

type Props = {
  area: DemoPreviewArea;
};

export function DemoPreviewCard({ area }: Props) {
  const Icon = area.icon;

  return (
    <li className="mkt-features-workspace-card">
      <div className="mkt-features-workspace-icon" aria-hidden>
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <h3 className="mkt-features-card-title">{area.title}</h3>
      <p className="mkt-features-card-description">{area.description}</p>
      <ul className="mkt-ai-page-examples" aria-label={`${area.title} topics`}>
        {area.topics.map((topic) => (
          <li key={topic}>{topic}</li>
        ))}
      </ul>
    </li>
  );
}
