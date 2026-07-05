"use client";

import { useEffect, useRef, useState } from "react";

type MetricProps = {
  value: number;
  formatter?: (value: number) => string;
  duration?: number;
  className?: string;
};

export function Metric({
  value,
  formatter = (next) => String(Math.round(next)),
  duration = 640,
  className,
}: MetricProps) {
  const [display, setDisplay] = useState(0);
  const previousValue = useRef(0);
  const isFirstMount = useRef(true);

  useEffect(() => {
    const start = isFirstMount.current ? 0 : previousValue.current;
    isFirstMount.current = false;
    const delta = value - start;

    if (delta === 0) {
      return;
    }

    const startTime = performance.now();
    let frame = 0;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(start + delta * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        previousValue.current = value;
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <span className={className}>{formatter(display)}</span>;
}
