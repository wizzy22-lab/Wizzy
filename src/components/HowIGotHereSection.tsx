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
          What the work is, then how it gets decided.

          Under the head row rather than beside the name: these are two and
          four lines of prose, and the name's column narrows to 188px at `md`,
          which would run them as a ribbon down the side of the photo. Here
          they start on the section's main left edge — the one the caption, the
          years, the tiles and the brand links all already use — so the block
          adds no axis of its own.

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
