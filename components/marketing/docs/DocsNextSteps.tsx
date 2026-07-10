import Link from "next/link";

import type { DocsNextStep } from "@/lib/marketing/docs";

type Props = {
  steps: readonly DocsNextStep[];
};

export function DocsNextSteps({ steps }: Props) {
  return (
    <section className="mkt-docs-next-steps" aria-labelledby="docs-next-steps-heading">
      <h2 id="docs-next-steps-heading" className="mkt-docs-next-steps-title">
        Next steps
      </h2>
      <ul className="mkt-docs-next-steps-list" role="list">
        {steps.map((step) => (
          <li key={step.href} className="mkt-docs-next-step" role="listitem">
            <Link href={step.href} className="mkt-docs-next-step-link">
              {step.label}
            </Link>
            <p className="mkt-docs-next-step-description">{step.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
