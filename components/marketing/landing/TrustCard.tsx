import type { TrustCard as TrustCardData } from "@/lib/marketing/trust";

type Props = {
  card: TrustCardData;
};

export function TrustCard({ card }: Props) {
  const Icon = card.icon;

  return (
    <article className="mkt-trust-card">
      <div className="mkt-trust-icon" aria-hidden>
        <Icon className="size-5" strokeWidth={1.5} />
      </div>

      <h3 className="mkt-trust-title">{card.title}</h3>
      <p className="mkt-trust-description">{card.description}</p>
    </article>
  );
}
