import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { PlatformPillar } from "@/lib/marketing/pillars";
import { cn } from "@/lib/utils";

type Props = {
  pillar: PlatformPillar;
};

export function PlatformPillarCard({ pillar }: Props) {
  const Icon = pillar.icon;

  return (
    <article className="mkt-pillar-card">
      <div className="mkt-pillar-icon" aria-hidden>
        <Icon className="size-5" strokeWidth={1.5} />
      </div>

      <h3 className="mkt-pillar-title">{pillar.title}</h3>
      <p className="mkt-pillar-description">{pillar.description}</p>

      <ul className="mkt-pillar-features">
        {pillar.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <Link href={pillar.href} className={cn("mkt-pillar-link", "group")}>
        {pillar.ctaLabel}
        <ArrowRight
          className="size-4 transition-transform duration-[var(--mkt-duration)] ease-[var(--mkt-ease)] group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
    </article>
  );
}
