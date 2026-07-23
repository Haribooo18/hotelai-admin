import { useSyncExternalStore } from "react";

function subscribe(): () => void {
  // Nothing to subscribe to — "has this component mounted on the client"
  // never changes after it flips true once, so there are no further
  // updates to notify React about.
  return () => {};
}

function getSnapshot(): boolean {
  return true;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * True once the component has mounted on the client, false during the
 * server render and the client's first (pre-hydration) render.
 *
 * Use this instead of `useState(false) + useEffect(() => setState(true))`
 * for the same value: that pattern calls `setState` unconditionally from
 * an effect body, which is exactly the anti-pattern
 * `react-hooks/set-state-in-effect` flags (see
 * https://react.dev/learn/you-might-not-need-an-effect) — cascading
 * renders and, in practice, calling setState synchronously in an effect
 * to derive a value from render is a smell. `useSyncExternalStore` is the
 * primitive React actually provides for "this value legitimately differs
 * between server and client" (a real external store — the fact that
 * we're running in a browser at all — not app state), and it's already
 * the pattern this codebase uses for locale detection in I18nProvider.
 *
 * Typical use: derive any value that must be identical on the server and
 * the client's first render (to avoid a hydration mismatch), then switch
 * to its real value once mounted.
 *
 *   const mounted = useHasMounted();
 *   const now = mounted ? new Date() : null;
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
