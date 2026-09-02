import Image from "next/image";
import type { Dictionary } from "@/content/dictionaries";
import { TIMELINE_PHOTOS } from "@/content/timeline";

/** Ties the row list to the caption above it — the list is not a heading's child. */
const TIMELINE_CAPTION_ID = "about-timeline-caption";

export default function HowIGotHereSection({ dict }: { dict: Dictionary }) {
  const { timeline } = dict;

  return (
    <section
      id="about"
      data-theme="light"
      className="w-full scroll-mt-[70px] bg-bg py-[var(--section-gap)] font-sans"
    >
      <div className="mx-auto w-full max-w-[1920px] px-6 md:px-16 xl:px-[180px] 2xl:px-[360px]">
        {/*
          The section head is the person, not the list.

          Everywhere else the page says "wizzy", which brands the work but never
          names whoever made it — so the applicant's name is stated once, here,
          at the top of about. It takes the display tier and the role sits under
          it as a label: the same size-then-ramp-then-face stack the hero uses,
          which is the only way this system builds hierarchy.

          `brand.role` rather than a second copy of the same words — the header
          dropped its role line, so this is where that string lives now.

          Photo and name share a row rather than stacking. Given the whole
          container the photo rendered 1200×900 — larger than anything else on
          the page, and larger than the person it introduces. A column is the
          size limit, so no max-width has to be invented to hold it back.

          The break is `md`, where the rows below already turn into columns:
          one column break for the whole section rather than two. Tablet needs
          it as much as desktop — at 1023px a full-width photo is still 896
          across.

          `gap-10` is the gutter those rows use (`gap-x-10`), read sideways
          here and vertically once the row stacks.

          Centred rather than top-aligned: two lines of text against a photo
          four times their height. ProjectSection top-aligns because both of
          its columns are tall; here only one is, and `items-start` would leave
          the name looking like a column that stopped early.

          No `justify-between`: it would strand a two-word name against the
          right edge with a hole in the middle. Packed left, the row's ragged
          right matches the caption and the rows underneath it.
        */}
        <div className="flex flex-col gap-10 md:flex-row md:items-center">
          {/*
            Left-aligned now. The name shares a row instead of sitting over a
            full-width band, so it starts at the same left edge as the caption,
            the rows and the tiles below it — the centring was the one thing in
            the section that did not.
          */}
          <div>
            <h2 className="text-display font-medium text-text">
              {dict.about.name}
            </h2>
            <p className="type-label mt-3 text-dim">{dict.brand.role}</p>
          </div>

          {/*
            Second in the DOM, first on screen. The <h2> is this section's
            heading and has to stay the first thing announced — `#about` lands
            a screen reader here — so the frame moves left with `order-first`
            rather than by writing an image ahead of the heading it belongs to.
            Stacked, the order is the one it always was: name, role, photo.

            Two fifths of the container, so the frame tracks the width the
            section's own padding already decides — 480px at the widest.
            `shrink-0` keeps that share exact, so a longer name in another
            locale wraps instead of squeezing the photo out of ratio.

            4:3 crops the source (1600×1200) exactly, so nothing is thrown
            away, and landscape is the one shape the six square tiles below
            have not already taken.

            Same `rounded-[var(--radius-card)]` over `bg-surface` as those
            tiles and the business-case frames — one treatment for every image
            on the site. Below the fold, so it lazy-loads: no `preload`.

            `sizes` is the container arithmetic times two fifths, since the gap
            comes off the text column and never off the photo. It tops out at
            480px, so the browser stops reaching for the 4K candidate.
          */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] bg-surface md:order-first md:w-2/5 md:shrink-0">
            <Image
              src="/about/about-working.webp"
              alt={dict.about.photoAlt}
              fill
              sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1279px) calc((100vw - 128px) * 0.4), (max-width: 1535px) calc((100vw - 360px) * 0.4), (max-width: 1919px) calc((100vw - 720px) * 0.4), 480px"
              className="object-cover"
            />
          </div>
        </div>

        {/*
          "How I got here" titles the rows below it, so it sits on them rather
          than floating at the top of the section — a caption at label scale,
          left-aligned with the rows it names. A <p>, not a heading: the rows
          are already h3, and a heading here would sit at the same level as
          the things it introduces.
        */}
        <p id={TIMELINE_CAPTION_ID} className="type-label mt-20 text-dim">
          {timeline.title}
        </p>

        {/*
          A list of rows, not a drawn timeline: the years already carry the
          sequence, so the vertical rule, dots and left/right staggering were
          all restating it. Rules between rows do the same job in 1px.
        */}
        <ul aria-labelledby={TIMELINE_CAPTION_ID} className="mt-5 border-b border-border">
          {timeline.items.map((item, i) => (
            <li
              key={i}
              className="grid gap-x-10 gap-y-1 border-t border-border py-4 md:grid-cols-[112px_minmax(0,260px)_minmax(0,1fr)] md:items-baseline"
            >
              <span className="type-label text-dim">{item.year}</span>
              <h3 className="text-body font-medium text-text">{item.title}</h3>
              <p className="text-body text-dim">{item.description}</p>
            </li>
          ))}
        </ul>

        {/*
          Photos leave the rows and regroup as one band of equal tiles. Freed
          from the text they no longer need to be the same height as a
          paragraph, so they can all share one square format.
        */}
        <ul className="mt-12 grid grid-cols-3 gap-5 sm:grid-cols-6">
          {TIMELINE_PHOTOS.map((photo, i) => (
            <li
              key={photo}
              className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-surface"
            >
              <Image
                src={photo}
                alt={timeline.items[i]?.title ?? ""}
                fill
                sizes="(max-width: 640px) 33vw, 16vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
