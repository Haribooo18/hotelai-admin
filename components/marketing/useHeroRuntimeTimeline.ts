"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

import {
  deriveHeroRuntimePlayback,
  getHeroRuntimeIdleSnapshot,
  heroRuntimeSnapshotsEqual,
  type HeroRuntimeSnapshot,
} from "@/lib/marketing/hero-runtime-events";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Sparse React updates for Hero Runtime entrance + event timeline.
 * Entrance plays once; then idle/event cycles.
 * Playback pauses while the page is hidden or the component is off-screen.
 */
export function useHeroRuntimeTimeline(
  rootRef: RefObject<Element | null>
): HeroRuntimeSnapshot {
  const [snapshot, setSnapshot] = useState<HeroRuntimeSnapshot>(() =>
    getHeroRuntimeIdleSnapshot(0, true, "complete")
  );

  const snapshotRef = useRef(snapshot);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const pausedElapsedRef = useRef(0);
  const startedOnceRef = useRef(false);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || prefersReducedMotion()) {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const stopLoop = () => {
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
      const next = deriveHeroRuntimePlayback(elapsed, false);

      if (!heroRuntimeSnapshotsEqual(snapshotRef.current, next)) {
        snapshotRef.current = next;
        setSnapshot(next);
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (
        runningRef.current ||
        prefersReducedMotion() ||
        document.visibilityState === "hidden"
      ) {
        return;
      }

      if (!startedOnceRef.current) {
        startedOnceRef.current = true;
        pausedElapsedRef.current = 0;

        const pendingSnapshot = getHeroRuntimeIdleSnapshot(
          0,
          false,
          "pending"
        );

        snapshotRef.current = pendingSnapshot;
        setSnapshot(pendingSnapshot);
      }

      runningRef.current = true;
      frameRef.current = requestAnimationFrame(tick);
    };

    const onMotionPreference = () => {
      if (media.matches) {
        stopLoop();
        pausedElapsedRef.current = 0;

        const completeSnapshot = getHeroRuntimeIdleSnapshot(
          0,
          true,
          "complete"
        );

        snapshotRef.current = completeSnapshot;
        setSnapshot(completeSnapshot);
        return;
      }

      startLoop();
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        stopLoop();
        return;
      }

      startLoop();
    };

    media.addEventListener("change", onMotionPreference);
    document.addEventListener("visibilitychange", onVisibility);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry?.isIntersecting &&
          entry.intersectionRatio >= 0.25
        ) {
          startLoop();
          return;
        }

        stopLoop();
      },
      {
        threshold: [0, 0.25, 0.5],
      }
    );

    observer.observe(root);

    return () => {
      stopLoop();
      observer.disconnect();
      media.removeEventListener("change", onMotionPreference);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [rootRef]);

  return snapshot;
}