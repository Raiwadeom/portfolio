"use client";

/**
 * A media query as React state.
 *
 * Uses useSyncExternalStore so the value is read at the same moment React
 * commits — no flash of the wrong layout after hydration, and no effect that
 * has to run before the component knows which shape it is.
 *
 * The server snapshot is always `false`: the server has no viewport, so
 * markup is rendered for the wider layout and narrowed on the client.
 */

import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (notify: () => void) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
