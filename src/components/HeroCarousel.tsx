"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import type { ResolvedHeroCard } from "@/content/hero-cards";

// Only the two stylesheets this carousel actually uses — the core layout and
// the coverflow effect. `swiper/css/bundle` would pull in every module's CSS,
// navigation and pagination included, none of which this renders.
import "swiper/css";
import "swiper/css/effect-coverflow";

/**
 * Coverflow geometry.
 *
 * Kept out of JSX so the arc is one place to tune. `slideShadows` is off on
 * purpose: the depth comes from `filter: brightness()` on the inactive slides
 * (see `globals.css`), which reads as light falling off rather than as a
 * gradient painted over the card.
 */
const COVERFLOW = {
  // 25, not 30: coverflow multiplies this by the slide's distance from centre,
  // and past 90 degrees a card turns through edge-on and comes back mirrored —
  // the label on the outermost card renders backwards. With the arc centred,
  // the furthest slide is three out, so 25 tops out at 75 and every card stays
  // facing the reader.
  rotate: 25,
  depth: 200,
  stretch: 0,
  modifier: 1,
  slideShadows: false,
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
        modules={[EffectCoverflow]}
        effect="coverflow"
        coverflowEffect={COVERFLOW}
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
