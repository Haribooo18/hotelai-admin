"use client";

import { useEffect, useRef, useState } from "react";

import {
  deriveWhyNeedStory,
  getWhyNeedStaticSnapshot,
  WHY_NEED_CYCLE_MS,
  whyNeedSnapshotsEqual,
  type WhyNeedStorySnapshot,
} from "@/lib/marketing/why-hotels-need-story";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Drives the why-hotels-need fragmented → propagation → sync story.
 * Starts near the viewport; reduced motion stays on the quiet static state.
 */
export function useWhyHotelsNeedStory(
  enabled: boolean
): WhyNeedStorySnapshot {
  const [animatedSnapshot, setAnimatedSnapshot] =
    useState<WhyNeedStorySnapshot>(() => getWhyNeedStaticSnapshot(0));

  const snapshotRef = useRef(animatedSnapshot);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const pausedElapsedRef = useRef(0);

  const shouldShowStaticState = !enabled || prefersReducedMotion();

  useEffect(() => {
    snapshotRef.current = animatedSnapshot;
  }, [animatedSnapshot]);

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateSnapshot = (next: WhyNeedStorySnapshot) => {
      if (whyNeedSnapshotsEqual(snapshotRef.current, next)) {
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

      if (startRef.current !== null) {
        pausedElapsedRef.current = performance.now() - startRef.current;
        startRef.current = null;
      }
    };

    const tick = (now: number) => {
      if (!runningRef.current) {
        return;
      }

      if (startRef.current === null) {
        startRef.current = now - pausedElapsedRef.current;
      }

      const elapsed = now - startRef.current;
      const next = deriveWhyNeedStory(elapsed);

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

      if (pausedElapsedRef.current <= 0) {
        pausedElapsedRef.current = 0;
        updateSnapshot(deriveWhyNeedStory(0));
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    const showStaticState = () => {
      stop();
      pausedElapsedRef.current = 0;
      updateSnapshot(getWhyNeedStaticSnapshot(0));
    };

    const onMotionPreference = () => {
      if (media.matches) {
        showStaticState();
        return;
      }

      start();
    };

    const root = document.getElementById("why-hotels-need");

    if (!root) {
      media.addEventListener("change", onMotionPreference);

      return () => {
        stop();
        media.removeEventListener("change", onMotionPreference);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry?.isIntersecting &&
          entry.intersectionRatio >= 0.2
        ) {
          start();
          return;
        }

        stop();
      },
      {
        threshold: [0, 0.2, 0.4],
      }
    );

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        stop();
        return;
      }

      const bounds = root.getBoundingClientRect();
      const isNearViewport =
        bounds.bottom > 0 && bounds.top < window.innerHeight;

      if (isNearViewport) {
        start();
      }
    };

    media.addEventListener("change", onMotionPreference);
    document.addEventListener("visibilitychange", onVisibility);
    observer.observe(root);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener("change", onMotionPreference);
    };
  }, [enabled]);

  return shouldShowStaticState
    ? getWhyNeedStaticSnapshot(0)
    : animatedSnapshot;
}

export { WHY_NEED_CYCLE_MS };