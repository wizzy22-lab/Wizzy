"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * The intro timeline, in milliseconds from the moment the first phase lands.
 *
 * These are the only numbers that decide the choreography — the CSS reads the
 * phase off `data-intro` and owns the durations, so nothing here needs to know
 * how long a fade takes. Total is 2.2s: the overlay is gone at 2.0 and the last
 * staggered element finishes its fade just before the attribute drops.
 */
const SETTLE_AT = 900;
const REVEAL_AT = 1400;
const OVERLAY_OUT_AT = 2000;
const DONE_AT = 2200;

/**
 * How long to wait for a painted frame before starting anyway.
 *
 * `requestAnimationFrame` is suspended outright in a hidden tab — not
 * throttled, stopped — so a page opened in the background would sit on
 * `pending` forever: blank, and with the scroll still locked. Long enough that
 * a visible tab always starts on a real frame instead, at 60fps by a factor of
 * nine.
 */
const START_ANYWAY_AT = 150;

/**
 * `pending` is what the server renders: the page is dressed for the intro
 * before a single frame is painted, so there is no flash of the finished page
 * ahead of it. `done` drops the attribute and every rule keyed off it.
 */
type Phase = "pending" | "cards" | "settle" | "reveal" | "done";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Read rather than stored, the same way the accordion reads its pin query.
 *
 * The server snapshot is `false` — motion allowed — because that is what the
 * server HTML is dressed for, and it keeps hydration honest. A visitor who
 * asked for less motion corrects it on the first client render, before any of
 * this is visible: the plate is `display: none` under that query anyway, so
 * what unmounts here was never painted.
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

/**
 * The hero's intro.
 *
 * A full-screen plate the colour of the page, with the carousel raised above
 * it and nothing else visible. The cards arrive, the arc shrinks back to the
 * place it actually occupies in the hero, and the plate dissolves to reveal
 * the page that was underneath the whole time.
 *
 * It wraps the page rather than sitting beside it because the phase has to be
 * an ancestor of everything it hides — one attribute, and the CSS decides what
 * each part of the page does with it. Children stay server components; only
 * this wrapper and the plate are client-side.
 *
 * Two things are deliberate. The attribute is rendered by React rather than
 * written to `<html>` by a script, so the server and client agree on the first
 * frame and no other route inherits an intro it has no way to end. And every
 * rule it drives lives inside `prefers-reduced-motion: no-preference`, so
 * reduced motion is not a fast intro but no intro: the page paints finished,
 * and the effect below unmounts the plate without ever locking the scroll.
 */
export default function HeroIntro({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("pending");
  const [plate, setPlate] = useState(true);

  useEffect(() => {
    if (reduced) return;

    /*
     * Hold the page at the top for the length of the intro.
     *
     * `overflow: hidden` is already stopping the visitor from scrolling, but it
     * does nothing about a scroll the page gives itself: a refresh restoring
     * the last position, or a third-party script moving the viewport. The arc
     * is the one thing standing above the plate and it scrolls with the page,
     * so any of those would slide it out of frame and leave a blank plate.
     *
     * `instant` because the document is set to scroll smoothly — an eased
     * correction would be a scroll of its own.
     */
    const pin = () => window.scrollTo({ top: 0, behavior: "instant" });
    pin();
    window.addEventListener("scroll", pin);

    const timers: ReturnType<typeof setTimeout>[] = [];
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      setPhase("cards");
      timers.push(
        setTimeout(() => setPhase("settle"), SETTLE_AT),
        setTimeout(() => setPhase("reveal"), REVEAL_AT),
        setTimeout(() => setPlate(false), OVERLAY_OUT_AT),
        setTimeout(() => setPhase("done"), DONE_AT),
        // The pin comes off with the last phase.
        setTimeout(() => window.removeEventListener("scroll", pin), DONE_AT),
      );
    };

    // Two frames, so the browser has painted `pending` before `cards` replaces
    // it. A transition needs a rendered start state to run from; flipping the
    // phase inside the same frame as hydration can skip straight to the end.
    const raf = requestAnimationFrame(() => requestAnimationFrame(start));

    // Whichever comes first. In a hidden tab no frame is ever painted, so the
    // timer is the one that runs — the intro advances unanimated, which is the
    // right outcome for a page nobody is looking at, and the scroll is released
    // on time either way.
    const fallback = setTimeout(start, START_ANYWAY_AT);

    return () => {
      window.removeEventListener("scroll", pin);
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      timers.forEach(clearTimeout);
    };
  }, [reduced]);

  return (
    // No attribute at all once it is over — every selector keyed off
    // `[data-intro]` stops matching, which is also what releases the scroll.
    <div data-intro={reduced || phase === "done" ? undefined : phase}>
      {!reduced && plate && <div className="hero-intro-plate" aria-hidden />}
      {children}
    </div>
  );
}
