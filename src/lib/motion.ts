"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Whether the visitor has asked for less motion.
 *
 * Read rather than stored, the same way the accordion reads its pin query.
 * The server snapshot is `false` — motion allowed — because that is what the
 * server HTML is dressed for, and it keeps hydration honest; a visitor who
 * asked for less corrects it on the first client render.
 *
 * Shared because two things now answer to it: the hero intro, which does not
 * play, and the carousel, which does not advance on its own.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}
