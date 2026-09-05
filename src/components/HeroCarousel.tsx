"use client";

import { useLayoutEffect, useRef, useState } from "react";
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
 * Coverflow geometry.
 *
 * Kept out of JSX so the arc is one place to tune. `slideShadows` is off on
 * purpose: the depth comes from `filter: brightness()` on the inactive slides
 * (see `globals.css`), which reads as light falling off rather than as a
 * gradient painted over the card.
 */
const COVERFLOW = {
  /*
   * 20, because `modifier` multiplies it.
   *
   * Coverflow turns each slide by `rotate * distance-from-centre * modifier`.
   * The arc is centred on index 2 of six, so the furthest slide is three out:
   * at 25 with the modifier now 1.2 that lands on exactly 90 degrees, and the
   * outermost card collapses to an edge-on sliver — measured at 59px wide
   * against the 315px of the centre card.
   *
   * 20 x 1.2 is 24 a step, which is the 25 the arc was drawn with, and tops
   * out at 72. The modifier is left to do what it was raised for: depth.
   */
  rotate: 20,
  depth: 260,
  stretch: 0,
  modifier: 1.2,
  slideShadows: false,
};

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
 * Which card the arc opens on.
 *
 * `centeredSlides` centres whichever slide is active, so starting at 0 puts
 * every other card to its right and hangs the arc off one edge. Starting near
 * the middle is what makes it an arc: cards fall away on both sides, and the
 * furthest is close enough to stay legible.
 */
const INITIAL_SLIDE = 2;

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
  const ref = useRef<HTMLDivElement | null>(null);

  /*
   * How far the arc has to travel to sit in the middle of the first screen.
   *
   * The intro holds it there, scaled up, and then releases it back to zero —
   * so this is measured once, from the position it already occupies, and
   * handed to the CSS as a length to translate by.
   *
   * `getBoundingClientRect` reports the transformed box, and the intro's scale
   * is already applied by the time this runs. That is fine: `transform-origin`
   * is the centre, and scaling about the centre leaves the centre where it
   * was — which is the only point being measured.
   */
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const centre = box.top + box.height / 2;
    el.style.setProperty(
      "--intro-y",
      `${Math.round(window.innerHeight / 2 - centre)}px`,
    );
  }, []);

  return (
    // The arc wants the full window, but the hero sits inside the page's
    // horizontal padding. Cancelling it with an equal negative margin is the
    // same bleed the open project card uses — the padding is responsive, so
    // the margin matches it step for step.
    <div
      ref={ref}
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
        centeredSlides
        initialSlide={INITIAL_SLIDE}
        grabCursor
        // Stage one: no autoplay, no loop. Drag only.
        loop={false}
        onSwiper={() => setReady(true)}
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
                className={`relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[var(--radius-card)] bg-surface ${
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
