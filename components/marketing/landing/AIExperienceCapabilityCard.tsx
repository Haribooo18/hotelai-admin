import type { AIExperienceCapability } from "@/lib/marketing/ai-experience";

type Props = {
  capability: AIExperienceCapability;
};

export function AIExperienceCapabilityCard({ capability }: Props) {
  const Icon = capability.icon;

  return (
    <article className="mkt-ai-capability-card">
      <div className="mkt-ai-capability-icon" aria-hidden>
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <h3 className="mkt-ai-capability-title">{capability.title}</h3>
      <ul className="mkt-ai-capability-features">
        {capability.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </article>
  );
}
