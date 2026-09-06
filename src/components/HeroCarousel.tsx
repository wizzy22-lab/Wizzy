"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, FreeMode } from "swiper/modules";
import type { ResolvedHeroCard } from "@/content/hero-cards";

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
 * Coverflow's own model is linear — `distance * modifier` — and over twelve
 * cards at this rotation that falls apart. 45 degrees at 1.3 is 58.5 a step,
 * so the third card out is past 90: turned through edge-on and drawn mirrored,
 * label and all. The sixth is past 340 and comes back round the front. Measured
 * on the linear version: six of the twelve rendered mirrored, and the
 * outermost read as front-facing at 351 degrees.
 *
 * So the multiplier saturates instead. `tanh` is 1.3 a step at the centre —
 * the fan the brief asks for, unchanged where anyone is looking — and flattens
 * to a ceiling of 1.6, which at `rotate: 45` is 72 degrees. Nothing ever
 * reaches 90, so nothing ever flips.
 *
 * It is also the right shape physically: cards in a real fan cannot keep
 * turning past each other, and they cannot keep receding either — the same
 * multiplier drives depth, so the far cards now stack at a fixed distance
 * rather than shrinking away forever.
 */
const ROTATION_CEILING = 1.6;
const ROTATION_PER_STEP = 1.3;

function fanModifier(centerOffset: number) {
  return (
    Math.tanh((centerOffset * ROTATION_PER_STEP) / ROTATION_CEILING) *
    ROTATION_CEILING
  );
}

/**
 * Coverflow geometry — a fan, not a row.
 *
 * Kept out of JSX so the shape is one place to tune. `slideShadows` is off on
 * purpose: the depth comes from `filter: brightness()` on the inactive slides
 * (see `globals.css`), which reads as light falling off rather than as a
 * gradient painted over the card.
 *
 * `stretch` closes the fan, and it closes it positive.
 *
 * The sign is the opposite of what it reads like. Coverflow multiplies stretch
 * by a signed offset — negative for the slides right of centre — so a negative
 * stretch pushes both sides further out. Measured on this fan: -20 left a 22px
 * gap between the centre card and its neighbour, -60 widened it to 45, and
 * -131 to 102. It was spreading the cards apart, not overlapping them.
 *
 * Positive, at 12% of the card, closes that gap and takes it about 26px past
 * touching — a fan, with each card in front of the next.
 *
 * A percentage rather than pixels so the shape survives the card resizing: the
 * same 12% closes it at the 300px card a wide window gets and at the 200px
 * floor a phone gets.
 */
const COVERFLOW = {
  rotate: 45,
  depth: 320,
  stretch: "12%",
  modifier: fanModifier,
  slideShadows: false,
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
  return (
    // The arc wants the full window, but the hero sits inside the page's
    // horizontal padding. Cancelling it with an equal negative margin is the
    // same bleed the open project card uses — the padding is responsive, so
    // the margin matches it step for step.
    <div
      role="region"
      // Named here rather than through Swiper's `a11y` option, which needs the
      // A11y module and the stylesheet that comes with it. One attribute does
      // the same job for a carousel with no navigation UI to announce.
      aria-label={label}
      className="hero-carousel mt-10 w-auto -mx-6 md:-mx-16 xl:-mx-[180px] 2xl:-mx-[360px]"
      data-ready={ready ? "" : undefined}
    >
      <Swiper
        modules={[EffectCoverflow, FreeMode]}
        effect="coverflow"
        coverflowEffect={COVERFLOW}
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
        // Stage one: no autoplay, no loop. Drag only.
        loop={false}
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
          swiper.slideTo(INITIAL_SLIDE, 0, false);
          setReady(true);
        }}
      >
        {cards.map((card, i) => (
          <SwiperSlide key={card.no}>
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
                {card.image ? (
                  <Image
                    src={card.image}
                    alt={card.label}
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                ) : (
                  <span className="type-label text-dim">
                    {card.no} · {card.label}
                  </span>
                )}
              </CardLink>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
