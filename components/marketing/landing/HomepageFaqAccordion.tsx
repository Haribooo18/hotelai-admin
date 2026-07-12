"use client";

import { useId, useState, type CSSProperties } from "react";

import type { HomepageFaqItem } from "@/lib/marketing/homepage-faq";
import { cn } from "@/lib/utils";

type Props = {
  items: HomepageFaqItem[];
};

const FAQ_COLUMN_SIZE = 4;

function FaqColumn({
  items,
  columnOffset,
  openId,
  onToggle,
  baseId,
}: {
  items: HomepageFaqItem[];
  columnOffset: number;
  openId: string | null;
  onToggle: (id: string) => void;
  baseId: string;
}) {
  return (
    <div className="mkt-homepage-faq-column">
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        const itemIndex = columnOffset + index;
        const triggerId = `${baseId}-trigger-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <article
            key={item.id}
            className={cn("mkt-homepage-faq-item", isOpen && "mkt-homepage-faq-item--open")}
            style={{ "--mkt-faq-index": itemIndex } as CSSProperties}
          >
            <h3 className="mkt-homepage-faq-question">
              <button
                id={triggerId}
                type="button"
                className="mkt-homepage-faq-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => onToggle(item.id)}
              >
                <span>{item.question}</span>
                <span className="mkt-homepage-faq-icon" aria-hidden />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="mkt-homepage-faq-panel"
              hidden={!isOpen}
            >
              <p className="mkt-homepage-faq-answer">{item.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function HomepageFaqAccordion({ items }: Props) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const leftColumn = items.slice(0, FAQ_COLUMN_SIZE);
  const rightColumn = items.slice(FAQ_COLUMN_SIZE);

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div className="mkt-homepage-faq-columns">
      <FaqColumn
        items={leftColumn}
        columnOffset={0}
        openId={openId}
        onToggle={handleToggle}
        baseId={baseId}
      />
      <FaqColumn
        items={rightColumn}
        columnOffset={FAQ_COLUMN_SIZE}
        openId={openId}
        onToggle={handleToggle}
        baseId={baseId}
      />
    </div>
  );
}
