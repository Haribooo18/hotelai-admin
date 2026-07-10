import type { AiPageCapability } from "@/lib/marketing/ai-page";

type Props = {
  capability: AiPageCapability;
};

export function AiCapabilityCard({ capability }: Props) {
  const Icon = capability.icon;

  return (
    <li className="mkt-features-workspace-card">
      <div className="mkt-features-workspace-icon" aria-hidden>
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <h3 className="mkt-features-card-title">{capability.title}</h3>
      <p className="mkt-features-card-description">{capability.description}</p>
      <ul className="mkt-ai-page-examples">
        {capability.examples.map((example) => (
          <li key={example}>{example}</li>
        ))}
      </ul>
    </li>
  );
}
