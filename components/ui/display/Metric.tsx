"use client";

import { useEffect, useRef, useState } from "react";

import { motionMetricCountUpDurationMs } from "@/lib/motion/kpi";

type MetricProps = {
  value: number;
  formatter?: (value: number) => string;
  duration?: number;
  className?: string;
};

function monavelEase(progress: number): number {
  return 1 - (1 - progress) ** 2.2;
}

export function Metric({
  value,
  formatter = (next) => String(Math.round(next)),
  duration = motionMetricCountUpDurationMs,
  className,
}: MetricProps) {
  const [display, setDisplay] = useState(value);
  const previousValue = useRef(value);
  const hasAnimated = useRef(false);
  const reducedMotion = useRef(false);
  const frame = useRef(0);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    cancelAnimationFrame(frame.current);

    if (reducedMotion.current) {
      setDisplay(value);
      previousValue.current = value;
      hasAnimated.current = true;
      return;
    }

    const start = hasAnimated.current ? previousValue.current : 0;
    hasAnimated.current = true;
    const delta = value - start;

    if (delta === 0) {
      setDisplay(value);
      previousValue.current = value;
      return;
    }

    setDisplay(start);

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(start + delta * monavelEase(progress));

      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
        previousValue.current = value;
      }
    }

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value, duration]);

  return (
    <span className={className} style={{ minWidth: "1ch" }}>
      {formatter(display)}
    </span>
  );
}
