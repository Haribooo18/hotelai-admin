import { cn } from "@/lib/utils";

type Props = {
  kicker: string;
  value: string;
  position: "top-start" | "top-end" | "bottom-start";
  className?: string;
};

export function HeroFloatingCard({ kicker, value, position, className }: Props) {
  return (
    <div
      className={cn(
        "mkt-hero-float-card",
        `mkt-hero-float-card--${position}`,
        className
      )}
      aria-hidden
    >
      <p className="mkt-hero-float-card-kicker">{kicker}</p>
      <p className="mkt-hero-float-card-value">{value}</p>
    </div>
  );
}
