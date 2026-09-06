"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * The intro timeline, in milliseconds from mount.
 *
 * These are the only numbers that decide the choreography — the CSS reads the
 * phase off `data-intro` and owns the durations, so nothing here needs to know
 * how long a fade takes.
 *
 * The card holds at full size for `SHRINK_AT`, comes down over 1.1s, and the
 * page arrives as it lands. 2.1s end to end.
 */
const SHRINK_AT = 300;
const REVEAL_AT = 1400;
const PLATE_OUT_AT = 1900;
const DONE_AT = 2100;

/** Set once the intro has run, so a second page view in the same tab skips it. */
export const PLAYED_KEY = "wz_intro_played";

/**
 * `pending` is what the server renders — the centre card already covering the
 * screen, everything else already in its final position underneath. `done`
 * drops the attribute and every rule keyed off it.
 *
 * There is no phase for the cards arriving, because they never arrive: the fan
 * is whole from the first frame, and the intro is one card getting out of the
 * way of it.
 */
type Phase = "pending" | "shrink" | "reveal" | "done";

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

/** Nothing to subscribe to — the flag is decided before the document parses. */
function subscribeNever() {
  return () => {};
}

/**
 * Whether the blocking script in `<head>` decided this view skips the intro.
 *
 * The decision cannot wait for React. `sessionStorage` is not knowable on the
 * server, so the server always renders the intro's first frame, and a skip
 * discovered after hydration would mean a flash of a screen-filling card
 * first. The script in the layout reads the key while the document is still
 * parsing and stamps `<html>`; the CSS keys the whole intro off the absence of
 * that stamp, so a skipped view paints finished. This hook only tells React
 * what has already been decided.
 */
function useIntroSkipped() {
  return useSyncExternalStore(
    subscribeNever,
    () => document.documentElement.hasAttribute("data-intro-skip"),
    () => false,
  );
}

/**
 * The hero's intro.
 *
 * One card — the middle of the fan — scaled up until it covers the screen. It
 * comes down, and the cards behind it were there the whole time: they are
 * uncovered rather than assembled. Then the page fades up around it.
 *
 * It wraps the page rather than sitting beside it because the phase has to be
 * an ancestor of everything it hides — one attribute, and the CSS decides what
 * each part of the page does with it. Children stay server components; only
 * this wrapper and the plate are client-side.
 *
 * Every rule it drives lives inside `prefers-reduced-motion: no-preference`,
 * so reduced motion is not a fast intro but no intro: the page paints
 * finished, and the scroll is never locked.
 */
export default function HeroIntro({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const skipped = useIntroSkipped();
  const inert = reduced || skipped;

  const [phase, setPhase] = useState<Phase>("pending");
  const [plate, setPlate] = useState(true);

  useEffect(() => {
    if (inert) return;

    try {
      sessionStorage.setItem(PLAYED_KEY, "1");
    } catch {
      // Private browsing refuses to store. The intro then plays on every view,
      // which is the previous behaviour rather than a broken one.
    }

    /*
     * Hold the page at the top for the length of the intro.
     *
     * `overflow: hidden` is already stopping the visitor from scrolling, but it
     * does nothing about a scroll the page gives itself: a refresh restoring
     * the last position, or a third-party script moving the viewport. The fan
     * stands above the plate and scrolls with the page, so either would slide
     * it out of frame and leave a blank plate.
     *
     * `instant` because the document is set to scroll smoothly — an eased
     * correction would be a scroll of its own.
     */
    const pin = () => window.scrollTo({ top: 0, behavior: "instant" });
    pin();
    window.addEventListener("scroll", pin);

    /*
     * Plain timers, and nothing waiting on a painted frame.
     *
     * The first phase change is 300ms out and transitions from the state the
     * server rendered, so by then it has certainly been painted — there is no
     * race here to lose. A hidden tab, where `requestAnimationFrame` is
     * suspended outright, still advances on these and still releases the
     * scroll on time.
     */
    const timers = [
      setTimeout(() => setPhase("shrink"), SHRINK_AT),
      setTimeout(() => setPhase("reveal"), REVEAL_AT),
      setTimeout(() => setPlate(false), PLATE_OUT_AT),
      setTimeout(() => setPhase("done"), DONE_AT),
      setTimeout(() => window.removeEventListener("scroll", pin), DONE_AT),
    ];

    return () => {
      window.removeEventListener("scroll", pin);
      timers.forEach(clearTimeout);
    };
  }, [inert]);

  return (
    // No attribute at all once it is over — every selector keyed off
    // `[data-intro]` stops matching, which is also what releases the scroll.
    <div data-intro={inert || phase === "done" ? undefined : phase}>
      {!inert && plate && <div className="hero-intro-plate" aria-hidden />}
      {children}
    </div>
  );
}
