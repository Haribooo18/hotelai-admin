import { TRUST_GUARANTEES, TRUST_SECTION_CONTENT } from "@/lib/marketing/trust";

export function TrustGuaranteesStrip() {
  return (
    <div className="mkt-trust-guarantees">
      <p className="mkt-trust-guarantees-label">
        {TRUST_SECTION_CONTENT.guaranteesLabel}
      </p>
      <ul
        className="mkt-trust-guarantees-list"
        aria-label="Runtime guarantees"
      >
        {TRUST_GUARANTEES.map((guarantee) => (
          <li key={guarantee.id} className="mkt-trust-guarantee">
            {guarantee.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
