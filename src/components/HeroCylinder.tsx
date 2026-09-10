"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ResolvedHeroCard } from "@/content/hero-cards";
import { useHeroMotionForced, usePrefersReducedMotion } from "@/lib/motion";

/**
 * How much wider the ring is than the polygon its cards would form edge to
 * edge.
 *
 * The cards sit on a cylinder, so the radius that makes them touch is fixed by
 * trigonometry alone — `w / (2·tan(π/n))` puts n cards of width w around a
 * circle with no gap and no overlap. Everything past that is a choice, and this
 * is the whole of it.
 *
 * At 1 the ring is a closed drum, each card's edge against the next. Past that
 * the ring widens and so do the gaps between the cards, in equal measure —
 * which is not a way to make the arc wider, only a way to make it emptier. The
 * width comes from `DECK_REPEATS` instead; this stays near 1 and only opens the
 * seams enough that the cards read as separate objects rather than as a drum.
 *
 * 1.05 against fourteen 353px cards gives a radius of 812 and a ring 1624
 * across, which runs past both edges of a 1455px window — the same bleed the
 * flat fan had. Turn this down toward 1 to tighten the seams, not up to widen
 * the arc.
 */
const RADIUS_K = 1.05;

/**
 * How many times the deck is laid around the ring.
 *
 * Seven cards cannot fill a desktop window on a closed cylinder, and no radius
 * fixes it. The ring on which n cards of width w stand edge to edge measures
 * `w / tan(π/n)` across — 734px for seven 353px cards, half of a 1455px
 * window. Opening the radius past that widens the ring and the gaps between
 * the cards in equal measure, which is the sparse, gappy arc the first version
 * drew. Filling the same window densely with seven would need each card 700px
 * wide; filling it at the size they are needs about thirteen of them.
 *
 * So the deck goes round twice. Fourteen positions of 25.7 degrees put the
 * ring at 1547px across at `RADIUS_K` 1.05 — wider than the window, which is
 * the bleed the flat fan had — with the cards touching rather than scattered.
 *
 * The repeat cannot be seen, and that is arithmetic rather than luck: with the
 * deck laid twice, a card and its twin are exactly 180 degrees apart, so one
 * is stowed behind the ring whenever the other is facing the viewer. There is
 * no angle at which both are on screen.
 */
const DECK_REPEATS = 2;

/** How long one card takes to drift past, in seconds. */
const SECONDS_PER_CARD = 3;

/**
 * The intro, which is the ring arriving rather than a card getting out of the
 * way of it.
 *
 * The ring is already whole and already turning when the page paints; what the
 * intro does is bleed off the speed. `SPIN_FROM` is a multiplier on the resting
 * drift, so at 15 the arc is a blur for an instant and at 1 it is the drift the
 * page settles into. `expo.inOut` spends most of the two seconds in the
 * deceleration, which is what makes it read as landing rather than as stopping.
 *
 * The frame does its own, shorter move underneath — up from 0.5 and level from
 * 12 degrees — so it has stopped resizing while the ring is still slowing.
 *
 * All of it runs in the same `requestAnimationFrame` loop as the drift, and
 * that is deliberate rather than incidental. The first version put the frame
 * move and the card fade in CSS keyframes; on the stage they sat frozen at
 * `currentTime: 0` with a play state of `running`, which held the ring at half
 * size and twelve degrees over for as long as the page was open. Rather than
 * chase it, the intro moved to where the rest of the motion already was —
 * one clock, and nothing to fall out of step with the angle.
 */
const SPIN_FROM = 15;
const SPIN_SETTLE_MS = 2000;
const FRAME_SETTLE_MS = 1200;
const CARD_FADE_MS = 800;

/** How long after a drag the ring waits before it drifts again. */
const RESUME_AFTER_DRAG = 2000;

/**
 * Drag distance for one full revolution, in viewport widths.
 *
 * Taste's number, and it holds up here: three widths to go all the way round
 * puts a fourteen-position ring at about a fifth of a width per card, which is
 * far enough that the arc does not spin away under a small movement and near
 * enough that it never feels geared down.
 */
const DRAG_WIDTHS_PER_TURN = 3;

/** How fast a released flick bleeds off, as a fraction kept per second. */
const INERTIA_DECAY = 0.06;
/** Below this, in degrees a second, the flick is over and the snap takes it. */
const INERTIA_FLOOR = 6;
/** How hard the ring is pulled onto the nearest card once the flick is spent. */
const SNAP_RATE = 9;

/**
 * `expo.inOut`, written out.
 *
 * The one easing the intro needs, and the reason there is no animation library
 * here: a cylinder driven by a single angle needs one curve and one loop, and
 * both fit in the file that uses them.
 */
function easeInOutExpo(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2;
}

/** Frame-rate independent approach — the same shape at 30fps and at 144. */
function approach(current: number, target: number, rate: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-rate * dt));
}

type CardLinkProps = {
  href: string | null;
  external: boolean;
  /**
   * The card's name, and the only place it is left. Nothing is drawn inside a
   * card, so without this a linked card reaches a screen reader as a link with
   * no name at all.
   */
  label: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * `<Link>` in-app, plain `<a>` off-site, and a non-interactive `<span>` when
 * there is no destination — the same three branches the project accordion
 * uses, and deliberately not an `<a href="#">`, which would be a dead link.
 */
function CardLink({
  href,
  external,
  label,
  className,
  children,
}: CardLinkProps) {
  if (href === null) {
    return (
      <span aria-disabled="true" className={className}>
        {children}
      </span>
    );
  }
  if (external) {
    return (
      <a href={href} aria-label={label} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} aria-label={label} className={className}>
      {children}
    </Link>
  );
}

/**
 * The hero's card ring.
 *
 * Seven cards standing on a cylinder, turning. Where the flat fan spread its
 * cards sideways and had to be stopped from marching off the screen, this one
 * has a back: a card turns away, dims out and is stowed behind the ring, and
 * comes round again. That is the whole reason for the shape, and it is what
 * the fan could not do — coverflow has no far side, so its outermost cards
 * saturated at 83.6 degrees and stood there as slivers.
 *
 * Two things follow from having a back, and both are why the file is a third
 * of what the fan's was. The ring closes, so there is nothing to wind back:
 * where the fan ran along a four-pass strip and stepped itself backwards
 * whenever it drifted out of the middle one, an angle simply keeps counting.
 * And position is one number, so the drift and the drag are the same mechanism
 * rather than two that have to be handed off between.
 *
 * The deck is still laid twice — see `DECK_REPEATS` — but a card and its twin
 * sit 180 degrees apart and are never both facing the viewer, so the second
 * pass is invisible rather than merely far away.
 *
 * No animation library. One angle, one `requestAnimationFrame` loop, one
 * easing curve written out above.
 */
export default function HeroCylinder({
  cards,
  label,
}: {
  cards: ResolvedHeroCard[];
  /** Accessible name for the region — the ring is otherwise unlabelled. */
  label: string;
}) {
  /*
   * The ring: the deck laid `DECK_REPEATS` times, in order.
   *
   * `copy` is what keeps the repeat out of the accessible tree. The panels are
   * identical, so a reader would otherwise meet every case twice and tab
   * through two sets of the same three links — `aria-hidden` for what is
   * announced and `inert` for what can be focused, since either alone leaves
   * the other half open.
   */
  const ring = Array.from({ length: cards.length * DECK_REPEATS }, (_, i) => ({
    card: cards[i % cards.length],
    i,
    copy: i >= cards.length,
  }));

  const stageRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [ready, setReady] = useState(false);

  // Both read unconditionally — `&&` would short-circuit the second hook.
  const reduced = usePrefersReducedMotion();
  const forced = useHeroMotionForced();
  const still = reduced && !forced;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const n = cards.length * DECK_REPEATS; // positions on the ring
    const step = 360 / n;
    const restingSpin = step / SECONDS_PER_CARD; // degrees a second

    /*
     * The radius is measured, not assumed.
     *
     * The card's width is a `clamp()` of viewport units (see `globals.css`), so
     * the only honest source for it is the element. Reading it here means the
     * ring is rebuilt from the real number on every resize, and the card can be
     * resized in CSS without a second copy of its size living in here.
     *
     * `offsetWidth`, and not `getBoundingClientRect()`, which was the first
     * version and was wrong: a rect is the painted box, so it carries every
     * ancestor transform — including the intro's own `scale(0.5)` on the stage.
     * Measuring mid-intro returned about 209px for a 353px card and built the
     * ring at a radius of 478 instead of 806, which drew a third of the arc it
     * should have. `offsetWidth` is the layout width and transforms cannot
     * reach it.
     */
    let radius = 0;
    const measure = () => {
      const card = panelRefs.current[0];
      const w = card ? card.offsetWidth : 0;
      radius = (w / (2 * Math.tan(Math.PI / n))) * RADIUS_K;
      for (const panel of panelRefs.current) {
        if (panel) panel.style.transformOrigin = `50% 50% ${-radius}px`;
      }
    };

    let angle = 0; // degrees; the ring's whole position
    let spinScale = still ? 1 : SPIN_FROM; // intro multiplier, eased to 1
    let velocity = 0; // degrees a second, from a released flick
    let snapping = false;
    let dragging = false;
    let resumeAt = 0; // timestamp the drift is allowed back
    const startedAt = performance.now();

    /*
     * Reduced motion is not a faster intro but no intro: the ring paints
     * finished and still, and stays still. It is still draggable — a
     * preference about being shown motion unasked is not a preference about
     * being unable to move something yourself.
     */
    let introDone = still;

    const draw = () => {
      for (let i = 0; i < panelRefs.current.length; i++) {
        const panel = panelRefs.current[i];
        if (!panel) continue;
        const theta = i * step + angle;
        panel.style.transform = `rotateY(${theta}deg)`;

        /*
         * Depth as one continuous function of the angle, which is the thing a
         * cylinder gives away for free.
         *
         * The fan could only afford three steps — active, its two neighbours,
         * and everything else flat at `brightness(0.82)` — because Swiper only
         * told it which slide was which. Here every card knows where it is, so
         * the light falls off with the cosine the way it would on a real drum.
         *
         * Opacity rides the same curve and reaches zero a little before the
         * card turns edge-on, so a card is already gone by the time its back
         * would show. That is the stow: it fades into the ring rather than
         * flipping to a mirrored face. `backface-visibility` in the CSS is the
         * backstop for the frame either side of it.
         */
        const face = Math.cos((theta * Math.PI) / 180); // 1 at the front, -1 behind
        panel.style.setProperty("--face", String(face));
      }
    };

    /*
     * The frame and the cards, as a function of milliseconds since mount.
     *
     * `easeOutExpo` here rather than the `inOut` the spin uses: the frame has
     * no distance to build up over, it only has to arrive, and an `inOut` on a
     * 1.2s move reads as a hesitation before it starts.
     *
     * The card fade is staggered out of order — index times a prime, modulo the
     * ring — so the deck wakes up rather than wiping across. It is written as a
     * separate custom property from `--face` because the two multiply: a card
     * that is stowed at the back must not fade in visibly first.
     */
    const dressFrame = (elapsed: number) => {
      const e = 1 - Math.pow(2, (-10 * elapsed) / FRAME_SETTLE_MS);
      const scale = 0.5 + 0.5 * Math.min(e, 1);
      const tilt = 12 * (1 - Math.min(e, 1));
      stage.style.transform = `scale(${scale}) rotate(${tilt}deg)`;

      const per = CARD_FADE_MS / panelRefs.current.length;
      for (let i = 0; i < panelRefs.current.length; i++) {
        const panel = panelRefs.current[i];
        if (!panel) continue;
        const delay = ((i * 37) % panelRefs.current.length) * per;
        const t = (elapsed - delay) / CARD_FADE_MS;
        panel.style.setProperty(
          "--intro-fade",
          String(t <= 0 ? 0 : t >= 1 ? 1 : t),
        );
      }
    };

    let last = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      // Clamped, so a tab coming back from the background does not integrate
      // one enormous step and throw the ring somewhere arbitrary.
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;

      if (!introDone) {
        const t = (now - startedAt) / SPIN_SETTLE_MS;
        spinScale = SPIN_FROM + (1 - SPIN_FROM) * easeInOutExpo(t);
        if (t >= 1) {
          spinScale = 1;
          introDone = true;
        }
      }
      // The frame's own move, and the cards arriving on top of it. Both are
      // finished well before the spin is, so they are computed unconditionally
      // and simply reach 1 and stay there.
      dressFrame(now - startedAt);

      if (dragging) {
        // The angle is written by the pointer handlers; nothing to integrate.
      } else if (Math.abs(velocity) > INERTIA_FLOOR) {
        angle += velocity * dt;
        velocity *= Math.pow(INERTIA_DECAY, dt);
        snapping = true;
      } else if (snapping) {
        velocity = 0;
        const nearest = Math.round(angle / step) * step;
        angle = approach(angle, nearest, SNAP_RATE, dt);
        if (Math.abs(nearest - angle) < 0.05) {
          angle = nearest;
          snapping = false;
        }
      } else if (!still && now >= resumeAt) {
        angle -= restingSpin * spinScale * dt;
      }

      draw();
      raf = requestAnimationFrame(frame);
    };

    measure();
    draw();
    // Finished, not started: under reduced motion this is the only call, and
    // otherwise it is overwritten by the first frame a millisecond later.
    dressFrame(still ? Infinity : 0);
    setReady(true);
    raf = requestAnimationFrame(frame);

    const onResize = () => {
      measure();
      draw();
    };
    window.addEventListener("resize", onResize);

    /* ---- Drag: the pointer writes the same angle the drift does ---- */

    let pointerId: number | null = null;
    let lastX = 0;
    let lastMoveAt = 0;

    const degPerPx = () => 360 / (window.innerWidth * DRAG_WIDTHS_PER_TURN);

    const onDown = (e: PointerEvent) => {
      // Let a click on a card be a click, not a one-pixel drag.
      if (e.button !== 0) return;
      pointerId = e.pointerId;
      dragging = true;
      snapping = false;
      velocity = 0;
      lastX = e.clientX;
      lastMoveAt = performance.now();
      // The intro is a scripted arrival; a hand on it ends it rather than
      // fighting it for the next second and a half.
      introDone = true;
      spinScale = 1;
      dressFrame(Infinity);
      stage.setPointerCapture?.(e.pointerId);
      stage.classList.add("is-grabbing");
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dt = Math.max((now - lastMoveAt) / 1000, 1 / 240);
      const delta = dx * degPerPx();
      angle += delta;
      velocity = delta / dt;
      lastX = e.clientX;
      lastMoveAt = now;
      draw();
    };

    const onUp = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      dragging = false;
      pointerId = null;
      stage.classList.remove("is-grabbing");
      // A stale velocity from a finger that stopped before it lifted would
      // throw the ring on release; only a live movement carries momentum.
      if (performance.now() - lastMoveAt > 120) velocity = 0;
      snapping = true;
      resumeAt = performance.now() + RESUME_AFTER_DRAG;
    };

    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [cards.length, still]);

  return (
    <div
      role="region"
      aria-label={label}
      // The ring wants the full window and the hero sits inside the page's
      // padding — but unlike the fan, nothing here is sized by its content, so
      // the bleed is the stage's own width rather than a negative margin that
      // turned out to do nothing.
      className="hero-cylinder"
      data-ready={ready ? "" : undefined}
    >
      <div ref={stageRef} className="hero-cylinder__stage">
        {ring.map(({ card, i, copy }) => (
          <div
            key={i}
            aria-hidden={copy || undefined}
            inert={copy}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="hero-cylinder__panel"
          >
            <CardLink
              href={card.href}
              external={card.external}
              label={card.label}
              className="hero-cylinder__card"
            >
              {/* `alt=""` — the link is named instead, so the artwork and the
                  link around it do not announce the same thing twice. */}
              {card.image && (
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="380px"
                  className="object-cover"
                  draggable={false}
                />
              )}
            </CardLink>
          </div>
        ))}
      </div>
    </div>
  );
}
