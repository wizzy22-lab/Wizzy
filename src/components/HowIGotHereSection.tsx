import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries";
import { BUSINESS_PROJECTS } from "@/content/projects";
import { TIMELINE_PHOTOS } from "@/content/timeline";

/** Ties the row list to the caption above it — the list is not a heading's child. */
const TIMELINE_CAPTION_ID = "about-timeline-caption";

/**
 * The section's column grid: year, title, description.
 *
 * Named rather than inlined because it is the section's own measure — the two
 * fixed tracks are what keep a year and its title the same width at every
 * size the grid applies to, instead of a share of the container that drifts
 * as it grows. Kept as one literal so Tailwind still sees the class.
 */
const ROW_COLUMNS = "md:grid-cols-[112px_minmax(0,260px)_minmax(0,1fr)]";

export default function HowIGotHereSection({
  lang,
  dict,
}: {
  /** Needed to prefix the brand links — this section is the only place they live now. */
  lang: Locale;
  dict: Dictionary;
}) {
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

          The mark elsewhere on the page is the same name set in the wordmark's
          lowercase — a brand treatment. This is where it is stated as a
          person's name, in the script the locale reads: "Haeji Wi" in English,
          "위해지" in Korean. It takes the display tier and the role sits under
          it as a label: the same size-then-ramp-then-face stack the hero uses,
          which is the only way this system builds hierarchy.

          `brand.role` rather than a second copy of the same words — the header
          dropped its role line, so this is where that string lives now.

          Two lines of text and nothing beside them, so no grid: the head
          starts on the section's own left edge, the one the caption, the
          rows, the tiles and the brand links all already use.
        */}
        <div>
          <h2 className="text-display font-medium text-text">
            {dict.about.name}
          </h2>
          <p className="type-label mt-3 text-dim">{dict.brand.role}</p>
        </div>

        {/*
          What the work is, then how it gets decided.

          Under the head rather than beside it: these are two and four lines
          of prose, and they start on the section's main left edge — the one
          the head, the caption, the years, the tiles and the brand links all
          already use — so the block adds no axis of its own.

          Two levels off the existing ramp, no new ones. The claim takes body
          weight at full strength; the evidence stays body at `text-dim`, a
          step down the same ramp, which is the only way this system marks
          something as supporting rather than leading.

          `max-w-[640px]` on the second is the measure every other run of prose
          on the site uses (`CaseStudyBody.tsx`, the case-study intros). The
          first line is one sentence and reads as a statement, so it is left to
          run.

          The second breaks one sentence per line — then, now, and the rule
          that came out of both — the same array-and-`<br>` the hero tail and
          the intro statement use.

          The breaks are held back below `md`, where the column is too narrow
          to hold a sentence anyway: forcing them there only bought a second,
          uneven rag under each line. From `md` up the measure is 640 and
          every sentence fits, so the break is the only one on the line and
          the sequence reads. Below it the text just flows.

          `mt-20` then `mt-10`: the section's interior gap, then half of it.
          The pair binds tighter to each other than to what follows.
        */}
        <p className="mt-20 text-body font-medium text-text">
          {dict.about.lead}
        </p>
        <p className="mt-10 max-w-[640px] text-body text-dim">
          {dict.about.approach.map((line, i) => (
            <span key={i}>
              {/* The space carries the join once the break is hidden — without
                  it the sentences butt together below `md`. At `md` and up it
                  is a space before a forced break, which collapses. */}
              {i > 0 && (
                <>
                  <br className="hidden md:inline" />{" "}
                </>
              )}
              {line}
            </span>
          ))}
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
        <ul
          aria-labelledby={TIMELINE_CAPTION_ID}
          className="mt-5 border-b border-border"
        >
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

          Four tiles now, not six, and the column counts follow the count
          rather than the other way round: two across on a phone and four from
          `sm` fills both rows exactly. Held at the old three-and-six, four
          tiles left two empty columns on a desktop and an orphan on a phone —
          which is the placeholder this change exists to avoid, drawn in
          whitespace instead of grey.

          The band starts on the section's main left edge either way, so the
          axis is the one the caption, the years and the brand links already
          share. Nothing here introduces one.

          A `null` renders no element at all — see `TIMELINE_PHOTOS`. The index
          is still the row's, so the alt text stays paired with the right year.
        */}
        <ul className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {TIMELINE_PHOTOS.map((photo, i) =>
            photo === null ? null : (
              <li
                key={photo}
                className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] bg-surface"
              >
                <Image
                  src={photo}
                  alt={timeline.items[i]?.title ?? ""}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              </li>
            ),
          )}
        </ul>

        {/*
          The brands, and the end of the page's argument.

          These two had a section of their own between the case studies and
          this one. That put the strongest real-world credential last, and by
          peak-end it was what a visitor left with — three product cases buried
          under a bakery. They belong here instead: this section is the
          history, and building and running a brand is part of it.

          Text links, not the filled pill the cases use. The pill is the page's
          primary call, and repeating it here would put these straight back in
          competition with the work the move was meant to keep in front.

          `mt-20` and `mt-5` are the gaps the caption and its rows already use,
          so a third block joins the section's rhythm instead of setting its
          own.

          `label-script text-label` rather than `type-label`, the same pairing
          the case CTAs use. This is a running phrase, not a chip: uppercase
          does nothing to Hangul, and the label token's 0.08em — sized for two
          or three Latin words — reads as a double space between every Korean
          word. `label-script` splits that by script, so KO gets the sans face
          at its own spacing and EN keeps the mono, untransformed.
        */}
        <p className="label-script mt-20 text-label text-dim">
          {dict.about.brandsLead}
        </p>
        <ul className="mt-5 flex flex-col gap-4 sm:flex-row sm:gap-10">
          {BUSINESS_PROJECTS.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/${lang}/projects/${project.slug}`}
                className="inline-flex items-baseline gap-2 text-body font-medium text-text transition-opacity hover:opacity-70"
              >
                {project.name}
                {/* The arrow is the affordance, so it sits on what you click
                    rather than on the label above. */}
                <span aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
