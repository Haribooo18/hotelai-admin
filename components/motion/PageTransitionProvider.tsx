"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  PAGE_TRANSITION_DURATION_MS,
  type PageTransitionPhase,
  type PageTransitionState,
} from "@/lib/motion/page-transition";

const PageTransitionContext = createContext<PageTransitionState | null>(null);

type Props = {
  children: ReactNode;
};

export function PageTransitionProvider({ children }: Props) {
  const pathname = usePathname();
  const [visiblePath, setVisiblePath] = useState(pathname);
  const [phase, setPhase] = useState<PageTransitionPhase>("idle");
  const [previousPathname, setPreviousPathname] = useState<string | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const enterFrameRef = useRef<number | null>(null);
  const outTimerRef = useRef<number | null>(null);
  const visiblePathRef = useRef(visiblePath);

  useEffect(() => {
    visiblePathRef.current = visiblePath;
  }, [visiblePath]);

  useEffect(() => {
    if (pathname === visiblePath) {
      if (phase !== "idle") {
        const idleFrame = window.requestAnimationFrame(() => {
          setPhase("idle");
        });

        return () => {
          window.cancelAnimationFrame(idleFrame);
        };
      }

      return;
    }

    outTimerRef.current = window.setTimeout(() => {
      outTimerRef.current = null;
      setPreviousPathname(visiblePathRef.current);
      setPhase("out");

      fadeTimerRef.current = window.setTimeout(() => {
        fadeTimerRef.current = null;
        setVisiblePath(pathname);
        setPhase("in");

        enterFrameRef.current = window.requestAnimationFrame(() => {
          enterFrameRef.current = window.requestAnimationFrame(() => {
            enterFrameRef.current = null;
            setPhase("idle");
          });
        });
      }, PAGE_TRANSITION_DURATION_MS);
    }, 0);

    return () => {
      if (outTimerRef.current !== null) {
        window.clearTimeout(outTimerRef.current);
        outTimerRef.current = null;
      }
      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }
      if (enterFrameRef.current !== null) {
        window.cancelAnimationFrame(enterFrameRef.current);
        enterFrameRef.current = null;
      }
    };
  }, [pathname, visiblePath, phase]);

  const value = useMemo<PageTransitionState>(
    () => ({
      pathname,
      visiblePath,
      previousPathname,
      phase,
      isTransitioning: phase !== "idle",
    }),
    [pathname, visiblePath, previousPathname, phase]
  );

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition(): PageTransitionState {
  const context = useContext(PageTransitionContext);

  if (context == null) {
    throw new Error(
      "usePageTransition must be used within PageTransitionProvider"
    );
  }

  return context;
}
