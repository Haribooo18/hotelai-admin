export type PageTransitionPhase = "idle" | "out" | "in";

export const PAGE_TRANSITION_DURATION_MS = 180;

export type PageTransitionState = {
  pathname: string;
  visiblePath: string;
  previousPathname: string | null;
  phase: PageTransitionPhase;
  isTransitioning: boolean;
};
