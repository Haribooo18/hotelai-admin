"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { WorkspaceAiPresenceState } from "./ai-recommendation-types";

type WorkspaceAiPresenceContextValue = {
  presence: WorkspaceAiPresenceState | null;
  setPresence: (state: WorkspaceAiPresenceState | null) => void;
};

const WorkspaceAiPresenceContext =
  createContext<WorkspaceAiPresenceContextValue | null>(null);

export function WorkspaceAiPresenceProvider({ children }: { children: ReactNode }) {
  const [presence, setPresenceState] = useState<WorkspaceAiPresenceState | null>(
    null
  );

  const setPresence = useCallback((state: WorkspaceAiPresenceState | null) => {
    setPresenceState(state);
  }, []);

  const value = useMemo(
    () => ({ presence, setPresence }),
    [presence, setPresence]
  );

  return (
    <WorkspaceAiPresenceContext.Provider value={value}>
      {children}
    </WorkspaceAiPresenceContext.Provider>
  );
}

export function useWorkspaceAiPresence(): WorkspaceAiPresenceState | null {
  const context = useContext(WorkspaceAiPresenceContext);
  return context?.presence ?? null;
}

export function useSetWorkspaceAiPresence(): (
  state: WorkspaceAiPresenceState | null
) => void {
  const context = useContext(WorkspaceAiPresenceContext);
  if (!context) {
    return () => undefined;
  }
  return context.setPresence;
}
