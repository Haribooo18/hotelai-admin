import type { ContactMethod } from "@/lib/marketing/contact-page";

type Props = {
  method: ContactMethod;
};

export function ContactMethodCard({ method }: Props) {
  const Icon = method.icon;

  return (
    <li className="mkt-contact-method-card">
      <div className="mkt-features-workspace-icon" aria-hidden>
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <h3 className="mkt-features-card-title">{method.title}</h3>
      <p className="mkt-features-card-description">{method.description}</p>
      <a href={`mailto:${method.email}`} className="mkt-contact-email">
        {method.email}
      </a>
    </li>
  );
}
