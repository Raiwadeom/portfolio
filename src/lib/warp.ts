/**
 * Scroll-driven warp level for the hero starfield, 0 → 1.
 *
 * A plain mutable box rather than React state: the hero's ScrollTrigger
 * writes to it every frame and the canvas reads it in its own rAF loop,
 * so the two stay in sync without re-rendering anything.
 */
export const warp = { value: 0 };
