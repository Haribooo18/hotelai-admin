"use client";

import { useEffect, useRef, useState } from "react";

import { MarketingButton } from "@/components/marketing/shared/MarketingButton";
import { AI_PAGE_CTA } from "@/lib/marketing/ai-page";
import { mktSectionHeadlineClass } from "@/lib/marketing/design";
import { cn } from "@/lib/utils";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function AiClosingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);

  const { beats, headline, body, actions, primaryCtaLabel, primaryCtaHref } =
    AI_PAGE_CTA;

  const active = prefersReducedMotion() || hasEnteredViewport;

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setHasEnteredViewport(true);
        observer.disconnect();
      },
      {
        threshold: 0.35,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={AI_PAGE_CTA.sectionId}
      className="mkt-ai-close"
      aria-labelledby="ai-closing-heading"
      data-active={active ? "true" : "false"}
    >
      <div className="mkt-container-wide">
        <div className="mkt-ai-close-inner">
          <p className="mkt-ai-close-beats">
            {beats.map((beat, index) => (
              <span key={beat}>
                {beat}
                {index < beats.length - 1 ? " " : null}
              </span>
            ))}
          </p>

          <h2
            id="ai-closing-heading"
            className={cn(mktSectionHeadlineClass, "mkt-ai-close-headline")}
          >
            {headline}
          </h2>

          <p className="mkt-ai-close-body">{body}</p>

          <div className="mkt-ai-close-stream" aria-label="Completed AI outcomes">
            <ul className="mkt-ai-close-stream-track" role="list">
              {[...actions, ...actions].map((action, index) => (
                <li key={`${action}-${index}`} role="listitem">
                  {action}
                </li>
              ))}
            </ul>
          </div>

          <div className="mkt-ai-close-buttons">
            <MarketingButton
              href={primaryCtaHref}
              variant="primary"
              size="section"
              mobileFull
            >
              {primaryCtaLabel}
            </MarketingButton>
          </div>
        </div>
      </div>
    </section>
  );
}