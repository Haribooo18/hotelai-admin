import type { ContactMethod } from "@/lib/marketing/contact-page";
import { cn } from "@/lib/utils";

type Props = {
  method: ContactMethod;
};

export function ContactMethodCard({ method }: Props) {
  const Icon = method.icon;
  const isPrimary = method.id === "sales";

  return (
    <li
      className={cn(
        "mkt-contact-method-card relative flex h-full min-h-0 flex-col !p-5",
        isPrimary &&
          "border-[#d8b66f]/20 bg-[linear-gradient(180deg,rgba(216,182,111,0.04),rgba(255,255,255,0.016))]"
      )}
    >
      {isPrimary ? (
        <span className="absolute right-5 top-5 rounded-full border border-[#d8b66f]/18 bg-[#d8b66f]/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#dfc47f]">
          Recommended
        </span>
      ) : null}

      <div className="mkt-features-workspace-icon !mb-4" aria-hidden>
        <Icon className="size-5" strokeWidth={1.5} />
      </div>

      <h3 className="mkt-features-card-title">{method.title}</h3>
      <p className="mkt-features-card-description mt-1.5">
        {method.description}
      </p>

      <a href={`mailto:${method.email}`} className="mkt-contact-email mt-4">
        {method.email}
      </a>

      <ul className="mt-4 flex flex-wrap gap-2">
        {method.highlights.slice(0, 3).map((highlight) => (
          <li
            key={highlight}
            className="rounded-full border border-white/[0.07] bg-white/[0.022] px-3 py-1.5 text-[10px] text-white/45"
          >
            {highlight}
          </li>
        ))}
      </ul>
    </li>
  );
}
