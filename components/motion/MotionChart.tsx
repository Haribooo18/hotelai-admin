"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  chartDataKey,
  motionChartCrossfadeDurationMs,
  motionChartEmptyClass,
  motionChartEnterDurationMs,
  motionChartSurfaceClass,
} from "@/lib/motion/chart";
import { cn } from "@/lib/utils";

type Props<T> = {
  data: T;
  empty?: boolean;
  className?: string;
  emptyContent: ReactNode;
  children: (data: T) => ReactNode;
};

export function MotionChart<T>({
  data,
  empty = false,
  className,
  emptyContent,
  children,
}: Props<T>) {
  const dataKey = chartDataKey(data);
  const hasMounted = useRef(false);
  const activeKeyRef = useRef(dataKey);
  const [displayData, setDisplayData] = useState(data);
  const [entering, setEntering] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const endEnter = window.setTimeout(
      () => setEntering(false),
      motionChartEnterDurationMs
    );
    return () => window.clearTimeout(endEnter);
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      activeKeyRef.current = dataKey;
      setDisplayData(data);
      return;
    }

    if (dataKey === activeKeyRef.current) {
      setDisplayData(data);
      return;
    }

    setFading(true);
    const timer = window.setTimeout(() => {
      activeKeyRef.current = dataKey;
      setDisplayData(data);
      setFading(false);
    }, motionChartCrossfadeDurationMs);

    return () => window.clearTimeout(timer);
  }, [dataKey, data]);

  if (empty) {
    return (
      <div className={cn(motionChartEmptyClass, className)}>{emptyContent}</div>
    );
  }

  return (
    <div
      className={cn(motionChartSurfaceClass, className)}
      data-entering={entering ? "true" : undefined}
      data-fading={fading ? "true" : undefined}
    >
      {children(displayData)}
    </div>
  );
}
