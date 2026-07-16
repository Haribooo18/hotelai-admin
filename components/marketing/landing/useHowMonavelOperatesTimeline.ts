"use client";

import { useEffect, useRef, useState } from "react";

import {
  deriveOperatePlayback,
  getOperateFinalSnapshot,
  OPERATE_CYCLE_MS,
  snapshotsEqual,
  type OperatePlaybackSnapshot,
} from "@/lib/marketing/how-monavel-operates-timeline";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Drives the operate-the-hotel cinematic timeline with sparse React updates.
 * Starts when the section is near the viewport and respects reduced motion.
 */
export function useHowMonavelOperatesTimeline(
  enabled: boolean
): OperatePlaybackSnapshot {
  const [animatedSnapshot, setAnimatedSnapshot] =
    useState<OperatePlaybackSnapshot>(() => getOperateFinalSnapshot());

  const snapshotRef = useRef(animatedSnapshot);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  const shouldShowFinalState = !enabled || prefersReducedMotion();

  useEffect(() => {
    snapshotRef.current = animatedSnapshot;
  }, [animatedSnapshot]);

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateSnapshot = (next: OperatePlaybackSnapshot) => {
      if (snapshotsEqual(snapshotRef.current, next)) {
        return;
      }

      snapshotRef.current = next;
      setAnimatedSnapshot(next);
    };

    const stop = () => {
      runningRef.current = false;

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      startRef.current = null;
    };

    const tick = (now: number) => {
      if (!runningRef.current) {
        return;
      }

      if (startRef.current === null) {
        startRef.current = now;
      }

      const elapsed = now - startRef.current;
      const next = deriveOperatePlayback(elapsed % OPERATE_CYCLE_MS);

      updateSnapshot(next);

      frameRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (
        runningRef.current ||
        prefersReducedMotion() ||
        document.visibilityState === "hidden"
      ) {
        return;
      }

      runningRef.current = true;
      startRef.current = null;

      updateSnapshot(deriveOperatePlayback(0));

      frameRef.current = requestAnimationFrame(tick);
    };

    const showFinalState = () => {
      stop();
      updateSnapshot(getOperateFinalSnapshot());
    };

    const onMotionPreference = () => {
      if (media.matches) {
        showFinalState();
        return;
      }

      start();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stop();
        return;
      }

      start();
    };

    media.addEventListener("change", onMotionPreference);
    document.addEventListener("visibilitychange", onVisibilityChange);

    const root = document.getElementById("how-monavel-works");

    if (!root) {
      return () => {
        stop();
        media.removeEventListener("change", onMotionPreference);
        document.removeEventListener(
          "visibilitychange",
          onVisibilityChange
        );
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry?.isIntersecting &&
          entry.intersectionRatio >= 0.35
        ) {
          start();
          return;
        }

        showFinalState();
      },
      {
        threshold: [0, 0.35, 0.6],
      }
    );

    observer.observe(root);

    return () => {
      stop();
      observer.disconnect();
      media.removeEventListener("change", onMotionPreference);
      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange
      );
    };
  }, [enabled]);

  return shouldShowFinalState
    ? getOperateFinalSnapshot()
    : animatedSnapshot;
}