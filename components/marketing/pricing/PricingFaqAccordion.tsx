"use client";

import { useId, useState } from "react";

import type { PricingFaqItem } from "@/lib/marketing/pricing-page";
import { cn } from "@/lib/utils";

type Props = {
  items: readonly PricingFaqItem[];
};

export function PricingFaqAccordion({ items }: Props) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mkt-pricing-page-faq-accordion">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const triggerId = `${baseId}-trigger-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <article
            key={item.id}
            className={cn(
              "mkt-pricing-page-faq-item",
              isOpen && "mkt-pricing-page-faq-item--open"
            )}
          >
            <h3 className="mkt-pricing-page-faq-question">
              <button
                id={triggerId}
                type="button"
                className="mkt-pricing-page-faq-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() =>
                  setOpenId((current) => (current === item.id ? null : item.id))
                }
              >
                <span className="mkt-pricing-page-faq-trigger-label">
                  {item.question}
                </span>
                <span className="mkt-pricing-page-faq-icon" aria-hidden />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="mkt-pricing-page-faq-panel"
              hidden={!isOpen}
            >
              <p className="mkt-pricing-page-faq-answer">{item.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
