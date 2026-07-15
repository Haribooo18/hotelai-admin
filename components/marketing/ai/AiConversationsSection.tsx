"use client";

import { useEffect, useRef, useState } from "react";

import { mktSectionHeadlineClass } from "@/lib/marketing/design";
import { AI_PAGE_CONVERSATIONS } from "@/lib/marketing/ai-page";
import { cn } from "@/lib/utils";

export function AiConversationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const { headline, items } = AI_PAGE_CONVERSATIONS;

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setActive(true);
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={AI_PAGE_CONVERSATIONS.sectionId}
      className="mkt-ai-talks"
      aria-labelledby="ai-conversations-heading"
      data-active={active ? "true" : "false"}
    >
      <div className="mkt-container-wide">
        <header className="mkt-ai-talks-header">
          <h2 id="ai-conversations-heading" className={mktSectionHeadlineClass}>
            {headline}
          </h2>
        </header>

        <ul className="mkt-ai-talks-grid" role="list">
          {items.map((item, index) => (
            <li
              key={item.id}
              className={cn(
                "mkt-ai-talks-item",
                item.emphasis === "money" && "mkt-ai-talks-item--money"
              )}
              data-step={String(Math.min(index, 11))}
              role="listitem"
            >
              <p className="mkt-ai-talks-request">{item.request}</p>
              <p
                className={cn(
                  "mkt-ai-talks-detail",
                  item.emphasis === "money" && "mkt-ai-talks-detail--money"
                )}
              >
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
