import Image from "next/image";
import type { Dictionary } from "@/content/dictionaries";
import { TIMELINE_PHOTOS } from "@/content/timeline";

/** Ties the row list to the caption above it — the list is not a heading's child. */
const TIMELINE_CAPTION_ID = "about-timeline-caption";

/**
 * The section's column grid: year, title, description.
 *
 * Named because two different things stand on it. The rows below use all three
 * tracks; the head above covers the first two with the photo and starts the
 * name on the third. That is what makes the head's edges land on the rows'
 * edges instead of near them — and because both tracks are fixed, the photo is
 * 412px (112 + 40 + 260) at every width the grid applies to, rather than a
 * share of the container that drifts away from a fixed column as it grows.
 *
 * One literal, used twice: Tailwind still sees the class to generate it, and
 * the two callers cannot fall out of step.
 */
const ROW_COLUMNS = "md:grid-cols-[112px_minmax(0,260px)_minmax(0,1fr)]";

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
          the page, and larger than the person it introduces.

          The row stands on `ROW_COLUMNS`, the same grid the years and their
          descriptions use, so the head is measured by the section rather than
          by a width picked for it. That is also what holds the photo back: two
          tracks is the size limit, and no max-width has to be invented.

          The break is `md`, where the rows already turn into columns: one
          column break for the whole section rather than two. Tablet needs it
          as much as desktop — at 1023px a full-width photo is still 896
          across.

          Centred rather than top-aligned: two lines of text against a photo
          four times their height. ProjectSection top-aligns because both of
          its columns are tall; here only one is, and `items-start` would leave
          the name looking like a column that stopped early.
        */}
        <div className={`flex flex-col gap-10 md:grid md:items-center ${ROW_COLUMNS}`}>
          {/*
            The name starts on the third track, where every description below
            it starts. Left-aligned now: it shares a row instead of sitting
            over a full-width band, so it begins at the same edge as the
            caption, the rows and the tiles — the centring was the one thing in
            the section that did not.
          */}
          <div className="md:col-start-3 md:row-start-1">
            <h2 className="text-display font-medium text-text">
              {dict.about.name}
            </h2>
            <p className="type-label mt-3 text-dim">{dict.brand.role}</p>
          </div>

          {/*
            Second in the DOM, first on screen. The <h2> is this section's
            heading and has to stay the first thing announced — `#about` lands
            a screen reader here — so the frame is placed on the first two
            tracks rather than written ahead of the heading it belongs to.
            Stacked, the order is the one it always was: name, role, photo.

            Covering the year and title tracks puts the frame's left edge on
            the years and its right edge on the titles. Both tracks are fixed,
            so the photo is 412px wherever the grid applies — the same size on
            a laptop as on a 4K display, which is the point: a fraction of the
            container would only meet a fixed column at one width and miss it
            everywhere else.

            4:3 crops the source (1600×1200) exactly, so nothing is thrown
            away, and landscape is the one shape the six square tiles below
            have not already taken.

            Same `rounded-[var(--radius-card)]` over `bg-surface` as those
            tiles and the business-case frames — one treatment for every image
            on the site. Below the fold, so it lazy-loads: no `preload`.

            `sizes` says so in two clauses: the container's width while the row
            is still stacked, and a flat 412 once it is not.
          */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] bg-surface md:col-span-2 md:col-start-1 md:row-start-1">
            <Image
              src="/about/about-working.webp"
              alt={dict.about.photoAlt}
              fill
              sizes="(max-width: 767px) calc(100vw - 48px), 412px"
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
              className={`grid gap-x-10 gap-y-1 border-t border-border py-4 md:items-baseline ${ROW_COLUMNS}`}
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
