"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { usePrefersReducedMotion } from "@/lib/motion";

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

/** Nothing to subscribe to — the stamp is written before the document parses. */
function subscribeNever() {
  return () => {};
}

/**
 * Whether `?intro=1` asked for the intro regardless of the motion preference.
 *
 * The script in the layout head reads the URL and stamps `<html>`; this reads
 * the stamp rather than the URL so that the CSS and the timeline can never
 * disagree about which one is in force.
 */
function useIntroForced() {
  return useSyncExternalStore(
    subscribeNever,
    () => document.documentElement.hasAttribute("data-intro-force"),
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
 *
 * Checking it from the console, note which element to measure. The scale is on
 * `.hero-carousel__card`, never on `.swiper-slide` around it — the slide's
 * transform belongs to Swiper, which rewrites it on every frame of the fan, so
 * a scale there would not survive one. The slide keeps its resting size all
 * the way through, and measuring that reports the intro as not running:
 *
 *   const card = document.querySelector(
 *     ".hero-carousel .swiper-slide-active .hero-carousel__card",
 *   );
 *   card.getBoundingClientRect().width / window.innerWidth;  // > 0.9 at the start
 *
 * It plays on every load, and reduced motion is the only thing that stops it
 * — `?intro=1` overrides even that, for reviewing it on a machine that has the
 * preference set. It was briefly once a session, keyed off
 * `sessionStorage`, and that is worth knowing if it comes back: the check
 * cannot live here. `sessionStorage` is not knowable on the server, so the
 * markup is always dressed for the intro's first frame, and a skip decided
 * after hydration is a skip that flashes a screen-filling card before it
 * takes. It has to be a blocking script in `<head>`, stamping `<html>` while
 * the parser is still above `<body>`, with the CSS keyed off that stamp.
 */
export default function HeroIntro({ children }: { children: React.ReactNode }) {
  // Both read unconditionally — `&&` would short-circuit the second hook.
  const reduced = usePrefersReducedMotion();
  const forced = useIntroForced();
  const inert = reduced && !forced;

  const [phase, setPhase] = useState<Phase>("pending");
  const [plate, setPlate] = useState(true);

  useEffect(() => {
    if (inert) return;

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
