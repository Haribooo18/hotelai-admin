"use client";

import { useEffect, useRef, useState } from "react";

import { AI_PAGE_STATUS, type AiStatusMetric } from "@/lib/marketing/ai-page";
import { mktSectionHeadlineClass } from "@/lib/marketing/design";
import { MKT_MOTION } from "@/lib/marketing/motion";

function formatMetricValue(metric: AiStatusMetric, progress: number): string {
  if (metric.numeric === undefined) {
    return metric.value;
  }

  const current = Math.round(metric.numeric * progress);

  if (metric.format === "currency") {
    return `$${current.toLocaleString("en-US")}`;
  }

  return String(current);
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function AiStatusSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const { headline, systems, metrics } = AI_PAGE_STATUS;

  const progress = prefersReducedMotion() ? 1 : animatedProgress;

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setActive(true);
        observer.disconnect();
      },
      {
        threshold: 0.28,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active || prefersReducedMotion()) {
      return;
    }

    const duration = MKT_MOTION.kpiCount;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const next = Math.min(1, (now - start) / duration);

      setAnimatedProgress(next);

      if (next < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [active]);

  return (
    <section
      ref={sectionRef}
      id={AI_PAGE_STATUS.sectionId}
      className="mkt-ai-status"
      aria-labelledby="ai-status-heading"
      data-active={active ? "true" : "false"}
    >
      <div className="mkt-container-wide">
        <header className="mkt-ai-status-header">
          <h2 id="ai-status-heading" className={mktSectionHeadlineClass}>
            {headline}
          </h2>
        </header>

        <div className="mkt-ai-status-panel" data-step="0">
          <ul
            className="mkt-ai-status-systems"
            role="list"
            aria-label="Connected systems"
          >
            {systems.map((system) => (
              <li
                key={system.id}
                className="mkt-ai-status-system"
                role="listitem"
              >
                <span className="mkt-ai-status-system-label">
                  {system.label}
                </span>

                <span className="mkt-ai-status-system-state">
                  <span className="mkt-ai-status-dot" aria-hidden />
                  {system.state}
                </span>
              </li>
            ))}
          </ul>

          <ul
            className="mkt-ai-status-metrics"
            role="list"
            aria-label="Reliability"
          >
            {metrics.map((metric) => (
              <li
                key={metric.id}
                className="mkt-ai-status-metric"
                role="listitem"
              >
                <span className="mkt-ai-status-metric-value">
                  {active
                    ? formatMetricValue(metric, progress)
                    : metric.value}
                </span>

                <span className="mkt-ai-status-metric-label">
                  {metric.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}