"use client";

/**
 * One item at a time is "out" — the open book, the top poster, the front
 * record — and it moves along on its own.
 *
 * The rules, in order:
 *  • while a mouse is over the group, the item under it is the one that's out;
 *  • for a few seconds after a tap, click or focus, the picked one stays put;
 *  • otherwise it advances by itself, on a timer.
 *
 * The timer only runs while the group is on screen, so a section further down
 * the page costs nothing until you reach it. Advancing on a timer rather than
 * on scroll position is what makes it behave the same on a phone, where there
 * is no cursor to drive anything and no guarantee of a scroll.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motionOn } from "@/lib/motion";

/** How long a deliberate pick holds the spotlight before the timer resumes. */
const HOLD_MS = 5000;

/** A hair of debounce, only enough to swallow the duplicate enter that fires
    when a transition finishes under a stationary cursor. Hit targets are flat
    strips that never move, so nothing longer is needed — and anything longer
    is felt as lag. */
const SETTLE_MS = 60;

export function useSpotlight<T extends HTMLElement>(
  count: number,
  { ms = 3000, enabled = true }: { ms?: number; enabled?: boolean } = {}
) {
  const scope = useRef<T>(null);
  const [index, setIndex] = useState(0);

  const hovering = useRef(false);
  const holdUntil = useRef(0);
  const settleUntil = useRef(0);
  const live = useRef(false);

  const set = useCallback((n: number) => {
    settleUntil.current = Date.now() + SETTLE_MS;
    setIndex(n);
  }, []);

  /** Hover / focus / tap handlers for one item. */
  const pick = useCallback(
    (n: number) => ({
      onPointerEnter: (e: React.PointerEvent) => {
        if (e.pointerType === "mouse") hovering.current = true;
        /* still settling from the last change — this enter is the layout
           moving under the cursor, not the reader aiming at something */
        if (Date.now() < settleUntil.current) return;
        set(n);
      },
      onFocus: () => {
        holdUntil.current = Date.now() + HOLD_MS;
        set(n);
      },
      onClick: () => {
        holdUntil.current = Date.now() + HOLD_MS;
        set(n);
      },
    }),
    [set]
  );

  /** Goes on the group's onPointerLeave, so the cursor hands control back. */
  const release = useCallback(() => {
    hovering.current = false;
    holdUntil.current = Date.now() + HOLD_MS;
  }, []);

  /** Pauses the timer without picking anything — for a group that drives its
      own index (Music, which also has to load a track, not just reorder a
      deck) but still wants the auto-advance to back off while a pointer is
      over it. */
  const hold = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "mouse") hovering.current = true;
  }, []);

  /* Nothing turns while the group is off screen. */
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        live.current = e.isIntersecting;
      },
      { rootMargin: "8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (count < 2 || !enabled || !motionOn()) return;

    const id = setInterval(() => {
      if (!live.current || hovering.current || Date.now() < holdUntil.current) return;
      settleUntil.current = Date.now() + SETTLE_MS;
      setIndex((n) => (n + 1) % count);
    }, ms);

    return () => clearInterval(id);
  }, [count, ms, enabled]);

  return { scope, index, pick, release, hold, set };
}
