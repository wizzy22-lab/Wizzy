"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, FreeMode } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import type { ResolvedHeroCard } from "@/content/hero-cards";
import { usePrefersReducedMotion } from "@/lib/motion";

// Only the two stylesheets this carousel actually uses — the core layout and
// the coverflow effect. `swiper/css/bundle` would pull in every module's CSS,
// navigation and pagination included, none of which this renders.
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/free-mode";

/**
 * How far a slide is turned, as a multiple of `rotate`, given its distance
 * from the centre in slide widths.
 *
 * Coverflow's own model is linear — `distance * modifier` — and this fan is
 * twelve cards wide, so linear breaks it twice over. Past 90 degrees a card is
 * drawn mirrored; past 270 it comes back round the front. Measured on the
 * linear version: six of twelve rendered mirrored, the outermost front-facing
 * at 351 degrees.
 *
 * So it saturates. The slope is what the fan looks like where anyone is
 * looking; the ceiling is what stops it ever reaching 90.
 *
 * The ceiling is doing a second job now, and it is the reason it is 3.8 rather
 * than the 1.6 it was. The same multiplier scales `depth`, so a low ceiling
 * capped how far the outer cards could recede — they kept their size, kept
 * their spacing, and marched straight off the screen. Letting it climb to 3.8
 * pushes them back far enough that perspective does the work: each step out is
 * a shorter step than the last, and the far cards converge instead of
 * escaping. `rotate` comes down to 22 to keep 3.8 under 90 — 83.6 degrees at
 * the ceiling, which is a sliver, which is what they should be.
 */
const ROTATION_CEILING = 3.8;

/**
 * `perStep` is how fast the turn builds where anyone is looking; the ceiling is
 * what stops it ever reaching 90 degrees, and it is shared, because it is
 * `rotate` that decides that limit and `rotate` does not change between the
 * two. At 22 degrees a ceiling of 3.8 tops out at 83.6.
 */
function makeFanModifier(perStep: number) {
  return (centerOffset: number) =>
    Math.tanh((centerOffset * perStep) / ROTATION_CEILING) * ROTATION_CEILING;
}

/**
 * Coverflow geometry — a fan, not a row.
 *
 * Kept out of JSX so the shape is one place to tune. `slideShadows` is off on
 * purpose: the depth comes from `filter: brightness()` on the inactive slides
 * (see `globals.css`), which reads as light falling off rather than as a
 * gradient painted over the card.
 *
 * `stretch` closes the fan, and it closes it positive. The sign is the
 * opposite of what it reads like: coverflow multiplies stretch by a signed
 * offset — negative for the slides right of centre — so a negative stretch
 * pushes both sides further out. Measured: -20 left a 22px gap between the
 * centre card and its neighbour, -60 widened it to 45, -131 to 102. Positive
 * 12% closes it and goes a little past touching.
 *
 * A percentage rather than pixels so the shape survives the card resizing.
 */
const DESKTOP_COVERFLOW = {
  rotate: 22,
  depth: 520,
  stretch: "12%",
  modifier: makeFanModifier(1.3),
  slideShadows: false,
} as const;

/**
 * The same fan, folded harder.
 *
 * A phone has a third of the width and the cards keep their full spacing in
 * the strip, so the desktop shape walks most of them off the screen. Both
 * numbers here work on the same mechanism: the multiplier scales `depth`, so
 * building it faster (2.2 a step against 1.3) and pushing further back (600
 * against 520) makes each step out a shorter step than the last. The fan
 * converges instead of marching.
 *
 * Nothing is hidden and no slide is dropped — all twelve are still there and
 * still reachable by dragging. What changes is how quickly they stack.
 */
const MOBILE_COVERFLOW = {
  rotate: 22,
  depth: 600,
  stretch: "12%",
  modifier: makeFanModifier(2.2),
  slideShadows: false,
} as const;

/**
 * Mobile-first: the base parameters are the phone's, and `lg` swaps in the
 * desktop fan. Swiper's breakpoints are min-width and it deep-merges them over
 * the base, so the whole object is restated rather than patched — a key left
 * out would keep the phone's value on a desktop.
 *
 * The card's own width crosses at the same 1024 in `globals.css`.
 */
const BREAKPOINTS = {
  1024: { coverflowEffect: DESKTOP_COVERFLOW },
} as const;

/**
 * How long a snap takes.
 *
 * Swiper writes `transition-duration` onto the slides itself — 0 while a
 * finger is down, this while it settles — so the easing has to come from CSS.
 * See `.hero-carousel .swiper-slide` in `globals.css`.
 */
const SPEED = 650;

/**
 * Drag with weight: the arc keeps going when the hand comes off and slows into
 * place instead of stopping dead.
 *
 * Two settings beyond the brief, both of which it is broken without.
 *
 * `sticky`, because free mode on its own coasts to a halt wherever the
 * momentum runs out and leaves the arc parked between two cards with nothing
 * centred — and a snap is half of what this is meant to do.
 *
 * `momentumBounce` off, because Swiper defaults it on: a hard flick is allowed
 * to carry the arc clean off the end of its own track and spring back. Measured
 * at 688px past `maxTranslate`, which on a centred arc is the whole thing
 * bunched against one edge with empty hero beside it. Off, the momentum is
 * clamped at the bounds and the snap takes it from there.
 */
const FREE_MODE = {
  enabled: true,
  momentum: true,
  momentumRatio: 0.6,
  momentumBounce: false,
  sticky: true,
};

/**
 * The rotation.
 *
 * 1600ms between moves against the 650ms it takes to make one: the fan is
 * still for about as long as it is moving, which is what reads as drifting
 * rather than ticking.
 *
 * `disableOnInteraction: false` because a drag should interrupt the drift, not
 * end it — the resume is handled below, on a delay, so the fan does not start
 * pulling against a hand that has only just come off it.
 */
const AUTOPLAY = {
  delay: 1600,
  disableOnInteraction: false,
  pauseOnMouseEnter: true,
};

/** How long the fan waits after a drag before it starts drifting again. */
const RESUME_AFTER_DRAG = 2000;

/**
 * How many times the twelve cards are laid into the strip.
 *
 * The endless drift is this strip plus the reset below, and not Swiper's
 * `loop`. Loop rearranges the slides it has around the active one, using an
 * estimate of how many fit on screen — and this fan defeats that estimate,
 * because its slides overlap heavily and eleven of them share the width of
 * about four. Measured with it on, at every index and at 24 and 36 slides and
 * 6 and 12 spare: the active card centred correctly with 839px of fan to its
 * left and 177px to its right, which is half the centre card and nothing else.
 * The right-hand side of the fan was simply absent.
 *
 * Four passes instead. The carousel never loops; it runs along a strip long
 * enough that it always has a full fan either side of wherever it is.
 */
const STRIP_PASSES = 4;

/**
 * Which card the fan opens on — the middle of twelve.
 *
 * `centeredSlides` centres whichever slide is active, so starting at 0 puts
 * every other card to its right and hangs the fan off one edge. Starting in
 * the middle is what makes it a fan: cards fall away on both sides.
 *
 * It is also the card the intro blows up to cover the screen, so it wants to
 * be the one with cards behind it in both directions.
 */
const INITIAL_SLIDE = 5;

type CardLinkProps = {
  href: string | null;
  external: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * `<Link>` in-app, plain `<a>` off-site, and a non-interactive `<span>` when
 * there is no destination — the same three branches the project accordion
 * uses, and deliberately not an `<a href="#">`, which would be a dead link.
 */
function CardLink({ href, external, className, children }: CardLinkProps) {
  if (href === null) {
    return (
      <span aria-disabled="true" className={className}>
        {children}
      </span>
    );
  }
  if (external) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/**
 * The hero's card arc.
 *
 * Six cards on a coverflow, centred, dragged by hand. Stage one carries no
 * autoplay and no loop: the arc is something a visitor moves, not something
 * that moves at them while they are reading the headline above it.
 *
 * The entrance waits for `onSwiper` rather than firing on mount, because
 * coverflow positions every slide with an inline transform the moment it
 * initialises. Animating before that runs would play the cards in from a flat
 * row and then snap them onto the arc; `opacity: 0` until ready covers that
 * same gap, so there is no flash of an uninitialised strip either.
 */
export default function HeroCarousel({
  cards,
  label,
}: {
  cards: ResolvedHeroCard[];
  /** Accessible name for the region — the carousel is otherwise unlabelled. */
  label: string;
}) {
  const [ready, setReady] = useState(false);
  const reduced = usePrefersReducedMotion();

  // The strip the loop actually runs on — see `STRIP_PASSES`.
  const strip = Array.from({ length: STRIP_PASSES }, () => cards).flat();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<SwiperClass | null>(null);
  const hoveredRef = useRef(false);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * The drift starts when the intro lets go, and not before.
   *
   * `HeroIntro` drops `data-intro` from the wrapper it renders around the page
   * as its last act, so that attribute disappearing is the signal. Watching for
   * it keeps the two components apart: the carousel does not need to know the
   * intro's timeline, only that it has finished, and if the intro is not there
   * at all — reduced motion, or a route without it — there is no attribute to
   * wait for and the fan starts immediately.
   */
  useEffect(() => {
    if (reduced) return;

    const start = () => swiperRef.current?.autoplay?.start();
    const wrapper = rootRef.current?.closest("[data-intro]");
    if (!wrapper) {
      start();
      return;
    }

    const observer = new MutationObserver(() => {
      if (wrapper.hasAttribute("data-intro")) return;
      start();
      observer.disconnect();
    });
    observer.observe(wrapper, {
      attributes: true,
      attributeFilter: ["data-intro"],
    });
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => () => {
    if (resumeRef.current) clearTimeout(resumeRef.current);
  }, []);

  return (
    // The arc wants the full window, but the hero sits inside the page's
    // horizontal padding. Cancelling it with an equal negative margin is the
    // same bleed the open project card uses — the padding is responsive, so
    // the margin matches it step for step.
    <div
      ref={rootRef}
      role="region"
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
      // Named here rather than through Swiper's `a11y` option, which needs the
      // A11y module and the stylesheet that comes with it. One attribute does
      // the same job for a carousel with no navigation UI to announce.
      aria-label={label}
      className="hero-carousel mt-10 w-auto -mx-6 md:-mx-16 xl:-mx-[180px] 2xl:-mx-[360px]"
      data-ready={ready ? "" : undefined}
    >
      <Swiper
        modules={[Autoplay, EffectCoverflow, FreeMode]}
        effect="coverflow"
        coverflowEffect={MOBILE_COVERFLOW}
        breakpoints={BREAKPOINTS}
        speed={SPEED}
        freeMode={FREE_MODE}
        // Each slide carries its own width (see `.hero-carousel .swiper-slide`
        // in globals.css), so the count across the viewport falls out of the
        // card size rather than being fixed here.
        slidesPerView="auto"
        /*
         * Negative, so the cards close up as they go out.
         *
         * `stretch` alone cannot do it. It is scaled by the same multiplier as
         * the rotation, and that multiplier has to saturate or the far cards
         * turn past 90 degrees and mirror — so past the second card out it
         * stops pulling anything further in, while the natural spacing keeps
         * growing by a full card each step. Measured with stretch alone: the
         * centre pair overlapped by 25px and the gap still opened to 47px
         * three cards out.
         *
         * This closes linearly and compounds with distance, which is the half
         * `stretch` cannot reach: the fan tightens toward its edges, the way a
         * fan does.
         */
        spaceBetween={-40}
        centeredSlides
        initialSlide={INITIAL_SLIDE}
        grabCursor
        autoplay={AUTOPLAY}
        /*
         * The seam, and why it cannot be seen.
         *
         * The strip is the same twelve cards four times over, so the view at
         * any index and the view twelve later are the same picture — the same
         * centre card, the same fan either side of it. Stepping back by
         * exactly twelve is therefore invisible: every pixel is where it was.
         *
         * Doing it whenever the active card leaves the second pass keeps a
         * whole pass of runway behind and two ahead, in both directions, so
         * the fan is never short of cards and the strip's real ends are never
         * approached. No duration, and no callbacks — this must not re-enter.
         */
        onSlideChange={(swiper) => {
          const n = cards.length;
          if (swiper.activeIndex >= n * 2) {
            swiper.slideTo(swiper.activeIndex - n, 0, false);
          } else if (swiper.activeIndex < n) {
            swiper.slideTo(swiper.activeIndex + n, 0, false);
          }
        }}
        // A drag interrupts the drift; the fan waits before taking it back, so
        // it is not pulling against a hand that has only just come off it. The
        // hover check is because `pauseOnMouseEnter` and this are two different
        // mechanisms, and resuming under a parked cursor would defeat it.
        onTouchStart={(swiper) => {
          if (resumeRef.current) clearTimeout(resumeRef.current);
          swiper.autoplay?.stop();
        }}
        onTouchEnd={(swiper) => {
          if (reduced) return;
          if (resumeRef.current) clearTimeout(resumeRef.current);
          resumeRef.current = setTimeout(() => {
            if (!hoveredRef.current) swiper.autoplay?.start();
          }, RESUME_AFTER_DRAG);
        }}
        onSwiper={(swiper) => {
          /*
           * Re-measure before anything is shown.
           *
           * Swiper's first pass sizes the strip from the slides alone and
           * misses the negative `spaceBetween` — measured at 3240px for twelve
           * 270px cards, the sum with no gaps applied, against the 2760 it
           * settles on. Everything downstream is computed from that number, so
           * the fan initialises off its own centre: the middle card landed
           * 233px right of the viewport centre at every width, far enough to
           * hang off the screen entirely on a phone.
           *
           * `update()` fixes the geometry but leaves the translate where it
           * was, which under the corrected arithmetic points at a different
           * card — so the position is set again explicitly, with no duration
           * and without firing transition events, while the plate still covers
           * everything.
           */
          swiper.update();
          // Into the second pass, so there is a full run of cards behind the
          // opening card as well as ahead of it.
          swiper.slideTo(cards.length + INITIAL_SLIDE, 0, false);

          // Swiper starts the drift on init. The intro owns the first two
          // seconds of the page, so it is held until the effect above says the
          // intro has finished — and under reduced motion, never.
          swiper.autoplay?.stop();
          swiperRef.current = swiper;
          setReady(true);
        }}
      >
        {strip.map((card, i) => (
          <SwiperSlide key={`${card.no}-${Math.floor(i / cards.length)}`}>
            {/*
              The stagger lives on this wrapper, never on the slide itself:
              Swiper writes an inline `transform` onto `.swiper-slide` on every
              frame of the coverflow, and an animation there would be overwritten
              on the next tick.
            */}
            <div
              className="hero-carousel__card"
              style={{ "--i": i } as React.CSSProperties}
            >
              <CardLink
                href={card.href}
                external={card.external}
                className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[var(--radius-card)] bg-surface ${
                  card.image ? "" : "border-2 border-dashed border-border"
                }`}
              >
                {card.image && (
                  <Image
                    src={card.image}
                    alt={card.label}
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                )}

                {/*
                  The caption, and only on the card in the middle. On every
                  card it read as twelve things labelled at once; on one it
                  names what is being shown. It sits at the foot of the card
                  rather than across the middle of it, so the artwork that
                  replaces the frame has somewhere to go.
                */}
                <span className="hero-carousel__label type-label absolute inset-x-0 bottom-6 px-3 text-center text-dim">
                  {card.no} · {card.label}
                </span>
              </CardLink>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
