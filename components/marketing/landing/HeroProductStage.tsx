import { HeroFloatingCard } from "@/components/marketing/landing/HeroFloatingCard";
import { ProductBrowserFrame } from "@/components/marketing/landing/ProductBrowserFrame";
import { HERO_FLOATING_CARDS } from "@/lib/marketing/hero-stage";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function HeroProductStage({ className }: Props) {
  return (
    <div className={cn("mkt-hero-stage", className)}>
      <div className="mkt-hero-ambient" aria-hidden />
      <div className="mkt-hero-stage-frame">
        <ProductBrowserFrame />
      </div>
      {HERO_FLOATING_CARDS.map((card) => (
        <HeroFloatingCard
          key={card.id}
          kicker={card.kicker}
          value={card.value}
          position={card.position}
        />
      ))}
    </div>
  );
}
