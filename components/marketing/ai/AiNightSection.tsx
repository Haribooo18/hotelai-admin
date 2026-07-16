"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { mktSectionHeadlineClass } from "@/lib/marketing/design";
import { AI_PAGE_NIGHT } from "@/lib/marketing/ai-page";
import { cn } from "@/lib/utils";

export function AiNightSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const { headline, events, summary } = AI_PAGE_NIGHT;

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
      id={AI_PAGE_NIGHT.sectionId}
      className="mkt-ai-night"
      aria-labelledby="ai-night-heading"
      data-active={active ? "true" : "false"}
    >
      <div className="mkt-container-wide">
        <header className="mkt-ai-night-header">
          <h2
            id="ai-night-heading"
            className={cn(mktSectionHeadlineClass, "mkt-ai-night-headline")}
          >
            {headline}
          </h2>
        </header>

        <div className="mkt-ai-night-layout">
          <ol className="mkt-ai-night-timeline" aria-label="Overnight activity">
            {events.map((event, index) => {
              const isMoney = Boolean(event.money);

              return (
                <li
                  key={event.id}
                  className="mkt-ai-night-event"
                  data-step={String(index)}
                >
                  <time className="mkt-ai-night-time" dateTime={event.time}>
                    {event.time}
                  </time>
                  <div className="mkt-ai-night-body">
                    <p className="mkt-ai-night-request">{event.request}</p>
                    <p
                      className={cn(
                        "mkt-ai-night-result",
                        isMoney && "mkt-ai-night-result--money"
                      )}
                    >
                      {isMoney ? null : (
                        <Check className="mkt-ai-night-check" aria-hidden strokeWidth={2} />
                      )}
                      <span>{event.result}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <aside
            className="mkt-ai-night-summary"
            data-step={String(events.length)}
            aria-label="Tonight summary"
          >
            <p className="mkt-ai-night-summary-title">{summary.title}</p>

            <ul className="mkt-ai-night-stats" role="list">
              {summary.stats.map((stat) => (
                <li key={stat.label} className="mkt-ai-night-stat" role="listitem">
                  <span className="mkt-ai-night-stat-value">{stat.value}</span>
                  <span className="mkt-ai-night-stat-label">{stat.label}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
