"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  motionSkeletonContentEnterClass,
  motionSkeletonCrossfadeRootClass,
  motionSkeletonExitClass,
} from "@/lib/motion/skeleton";
import { cn } from "@/lib/utils";

type Props = {
  loading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  className?: string;
};

const SKELETON_EXIT_MS = 200;

export function SkeletonCrossfade({
  loading,
  skeleton,
  children,
  className,
}: Props) {
  const [revealed, setRevealed] = useState(!loading);
  const wasLoadingRef = useRef(loading);

  useEffect(() => {
    if (loading) {
      wasLoadingRef.current = true;
      return;
    }

    if (!wasLoadingRef.current) {
      return;
    }

    const startTimer = window.setTimeout(() => setRevealed(false), 0);
    const revealTimer = window.setTimeout(
      () => setRevealed(true),
      SKELETON_EXIT_MS
    );

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(revealTimer);
    };
  }, [loading]);

  const crossfading = !loading && !revealed;
  const showSkeleton = loading || crossfading;
  const showContent = !loading && (crossfading || revealed);

  return (
    <div
      className={cn(motionSkeletonCrossfadeRootClass, className)}
      aria-busy={loading || crossfading || undefined}
    >
      {showSkeleton ? (
        <div
          className={cn(
            crossfading && [
              motionSkeletonExitClass,
              "pointer-events-none absolute inset-0 z-[1]",
            ]
          )}
          aria-hidden={crossfading}
        >
          {skeleton}
        </div>
      ) : null}

      {showContent ? (
        <div
          className={cn(
            loading && "invisible",
            crossfading && motionSkeletonContentEnterClass
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
