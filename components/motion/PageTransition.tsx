"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import { motionPresets } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

import { usePageTransition } from "./PageTransitionProvider";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function PageTransition({ children, className, style }: Props) {
  const { pathname, visiblePath, phase, isTransitioning } = usePageTransition();
  const [snapshot, setSnapshot] = useState(children);

  const showIncoming = phase === "in" && pathname === visiblePath;
  const isSettled = phase === "idle" && pathname === visiblePath;
  const renderedChildren = isSettled || showIncoming ? children : snapshot;

  useEffect(() => {
    if (phase !== "in" || pathname !== visiblePath) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSnapshot(children);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [phase, pathname, visiblePath, children]);

  return (
    <div
      data-phase={phase}
      data-transitioning={isTransitioning ? "true" : undefined}
      aria-busy={isTransitioning ? true : undefined}
      className={cn(motionPresets.page.root, className)}
      style={style}
    >
      {renderedChildren}
    </div>
  );
}
