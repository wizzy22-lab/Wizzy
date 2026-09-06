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

/** Nothing to subscribe to — the stamp is written before the document parses. */
function subscribeNever() {
  return () => {};
}

/**
 * Whether `?intro=1` asked for the hero's motion regardless of the preference.
 *
 * The script in the layout head reads the URL and stamps `<html>`; this reads
 * the stamp rather than the URL so the CSS, the intro and the carousel can
 * never disagree about which one is in force.
 *
 * It covers the drift as well as the intro. Reduced motion is a preference
 * about being shown motion unasked, and typing the parameter is asking — so an
 * override that revived the intro and left the carousel still would be an
 * override that cannot actually show you the hero.
 */
export function useHeroMotionForced() {
  return useSyncExternalStore(
    subscribeNever,
    () => document.documentElement.hasAttribute("data-motion-force"),
    () => false,
  );
}
