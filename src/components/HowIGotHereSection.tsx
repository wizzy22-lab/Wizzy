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
        */}
        <h2 className="text-center text-display font-medium text-text">
          {dict.about.name}
        </h2>
        <p className="type-label mt-3 text-center text-dim">
          {dict.brand.role}
        </p>

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
