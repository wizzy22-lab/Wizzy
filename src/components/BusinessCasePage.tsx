import Image from "next/image";
import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";
import type {
  BusinessCase,
  BusinessCasePhotoBlock,
  BusinessCasePhotoRatio,
} from "@/content/business-cases";

/**
 * Shared template for the business mini cases.
 *
 * Everything renders from the injected `BusinessCase` — the component owns
 * layout and nothing else, so a new case is a data file, not a new page.
 * Four sections, always in this order: Hero, What I Built, Cases, Takeaway.
 *
 * Styling stays on the main page's tokens (the `text`/`dim`/`faint` ramp, the
 * display face, the single `--radius-card`). No new colours or fonts: emphasis
 * is full-strength `text` against dimmed body copy — the display headings, the
 * key fact, each card's closing beat, and the button all read that way.
 *
 * The site header is intentionally not included — mount it in the route
 * alongside this component, the way `projects/[slug]/page.tsx` does.
 */

// Tailwind needs the full class name in the source, so every grid width is
// spelled out rather than composed from the `columns` value.
const GRID_COLUMNS: Record<1 | 2 | 3, string> = {
  1: "grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
};

const GRID_SIZES: Record<1 | 2 | 3, string> = {
  1: "(max-width: 1100px) 100vw, 1040px",
  2: "(max-width: 640px) 100vw, 520px",
  3: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px",
};

// Spelled out for the same reason as the column classes above.
const RATIOS: Record<BusinessCasePhotoRatio, string> = {
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
};

/**
 * Stand-in for a photo that isn't in the repo yet. Same dashed language the
 * main page uses for an unfilled slot, so a case reads as in-progress rather
 * than broken.
 */
function EmptySlot({ ratio }: { ratio: string }) {
  return (
    <div
      className={`flex ${ratio} items-center justify-center rounded-[var(--radius-card)] border border-dashed border-border bg-surface`}
    >
      <span className="type-label text-dim">PHOTO</span>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className=" text-heading text-text">
      {children}
    </h2>
  );
}

/**
 * Every photo grid on the page — products, brand graphics, the shop — renders
 * through this one component, so radius, gap, and frame are the same wherever
 * a block appears. Only the ratio and the column count vary, and both are set
 * by the block rather than by where it sits.
 *
 * A block whose photos would all repeat the same caption carries one caption
 * for the whole grid instead of per-photo ones.
 */
function PhotoBlock({
  block,
  locale,
  id,
}: {
  block: BusinessCasePhotoBlock;
  locale: Locale;
  id: string;
}) {
  const columns = block.columns ?? 3;
  const ratio = RATIOS[block.ratio ?? "landscape"];
  const caption =
    block.captions === "label" ? "type-label text-dim" : "text-body text-dim";

  return (
    <section className="mt-[var(--section-gap)] scroll-mt-[120px]" id={id}>
      <SectionHeading>{t(block.title, locale)}</SectionHeading>

      {block.intro && (
        <p className="mt-6 max-w-[640px] whitespace-pre-line text-body text-dim">
          {t(block.intro, locale)}
        </p>
      )}

      {/* A clip leading the block sits on its own row above the grid, held to
          the width it was encoded at so it never upscales. Muted, looping and
          inline: it plays as a moving still, with no controls to press. */}
      {block.video?.src && (
        <figure className="mt-10">
          <div className="relative aspect-video max-w-[1280px] overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
            <video
              src={block.video.src}
              poster={block.video.poster ?? undefined}
              aria-label={t(block.video.alt, locale)}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          </div>
          {block.video.caption && (
            <figcaption className={`mt-3 ${caption}`}>
              {t(block.video.caption, locale)}
            </figcaption>
          )}
        </figure>
      )}

      <div className={`mt-10 grid gap-5 ${GRID_COLUMNS[columns]}`}>
        {block.photos.map((photo, i) => (
          <figure key={i}>
            {photo.src ? (
              <div
                className={`relative ${ratio} overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface`}
              >
                <Image
                  src={photo.src}
                  alt={t(photo.alt, locale)}
                  fill
                  sizes={GRID_SIZES[columns]}
                  className="object-cover"
                />
              </div>
            ) : (
              <EmptySlot ratio={ratio} />
            )}
            {photo.caption && (
              <figcaption className={`mt-3 ${caption}`}>
                {t(photo.caption, locale)}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {block.caption && (
        <p className={`mt-6 ${caption}`}>{t(block.caption, locale)}</p>
      )}
    </section>
  );
}

export default function BusinessCasePage({
  data,
  locale,
}: {
  data: BusinessCase;
  locale: Locale;
}) {
  const { hero, blocks, cases, closingBlocks, takeaway } = data;
  // A block with nothing in it renders nothing at all, rather than a heading
  // over an empty grid.
  const filled = (list: BusinessCasePhotoBlock[] | undefined) =>
    (list ?? []).filter((b) => b.photos.length > 0 || b.video);
  // A square hero is centred and held narrower — full width it would push the
  // whole opening section below the fold.
  const heroFrame =
    hero.image?.ratio === "square"
      ? "mx-auto aspect-square max-w-[680px]"
      : "aspect-[16/9]";
  const next = takeaway.next;
  // An absolute URL points off-site; anything else is an in-app path that still
  // needs the current locale segment.
  const nextExternal = next ? /^https?:\/\//.test(next.href) : false;

  return (
    <article className="mx-auto w-full max-w-[1100px] px-6 pb-32 pt-[140px] md:px-10">
      {/* ① Hero */}
      <header>
        <h1 className="max-w-[900px] text-display text-text">
          {t(hero.title, locale)}
        </h1>

        <p className="mt-6 max-w-[640px] whitespace-pre-line text-body text-dim">
          {t(hero.subtitle, locale)}
        </p>

        {hero.meta.length > 0 && (
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-8 md:grid-cols-4">
            {hero.meta.map((item, i) => (
              <div key={i}>
                <dt className="type-label text-faint">
                  {t(item.label, locale)}
                </dt>
                <dd className="mt-2 whitespace-pre-line text-body text-text">
                  {t(item.value, locale)}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* The one number worth remembering */}
        <div className="mt-12">
          <p className=" text-heading text-text">
            {t(hero.keyFact.value, locale)}
          </p>
          <p className="mt-3 type-label text-dim">
            {t(hero.keyFact.label, locale)}
          </p>
        </div>

        {hero.lead && (
          <p className="mt-10 max-w-[640px] whitespace-pre-line text-body text-dim">
            {t(hero.lead, locale)}
          </p>
        )}

        {hero.image &&
          (hero.image.src ? (
            <div
              className={`relative mt-12 ${heroFrame} overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface`}
            >
              <Image
                src={hero.image.src}
                alt={t(hero.image.alt, locale)}
                fill
                preload
                sizes="(max-width: 1100px) 100vw, 1040px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="mt-12">
              <EmptySlot ratio={heroFrame} />
            </div>
          ))}
      </header>

      {/* ② Blocks between the hero and the cases */}
      {filled(blocks).map((block, i) => (
        <PhotoBlock key={i} block={block} locale={locale} id={`block-${i}`} />
      ))}

      {/* ③ Cases */}
      {cases.items.length > 0 && (
        <section className="mt-[var(--section-gap)] scroll-mt-[120px]" id="cases">
          <SectionHeading>{t(cases.title, locale)}</SectionHeading>

          {cases.intro && (
            <p className="mt-6 max-w-[640px] whitespace-pre-line text-body text-dim">
              {t(cases.intro, locale)}
            </p>
          )}

          <div className="mt-10 flex flex-col gap-8">
            {cases.items.map((item, i) => (
              <div
                key={i}
                className="rounded-[var(--radius-card)] border border-border bg-surface p-6"
              >
                <p className=" text-heading text-dim">
                  {String(i + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-4 max-w-[860px] text-heading text-text">
                  {t(item.title, locale)}
                </h3>

                <dl className="mt-8 flex flex-col gap-6">
                  {item.steps.map((step, si) => {
                    // The last beat is the payoff — result, lesson, whatever the
                    // card lands on — so it sits a step brighter than the rest.
                    const closing = si === item.steps.length - 1;
                    return (
                      <div
                        key={si}
                        className="grid gap-2 md:grid-cols-[140px_1fr] md:gap-6"
                      >
                        <dt className="type-label text-dim md:pt-1">
                          {t(step.label, locale)}
                        </dt>
                        <dd
                          className={`max-w-[640px] whitespace-pre-line text-body ${
                            closing ? "text-text" : "text-dim"
                          }`}
                        >
                          {t(step.body, locale)}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            ))}
          </div>

          {/* Shorter aside — same card language, no four-beat structure. */}
          {cases.note && (
            <div className="mt-8 rounded-[var(--radius-card)] border border-border bg-surface p-6">
              <h3 className="type-label text-dim">
                {t(cases.note.title, locale)}
              </h3>
              <p className="mt-4 max-w-[640px] whitespace-pre-line text-body text-text">
                {t(cases.note.body, locale)}
              </p>
            </div>
          )}
        </section>
      )}

      {/* ③b Blocks after the cases */}
      {filled(closingBlocks).map((block, i) => (
        <PhotoBlock key={i} block={block} locale={locale} id={`closing-${i}`} />
      ))}

      {/* ④ Takeaway */}
      <section className="mt-[var(--section-gap)] scroll-mt-[120px]" id="takeaway">
        <SectionHeading>{t(takeaway.title, locale)}</SectionHeading>

        <div className="mt-6 flex flex-col gap-6">
          {takeaway.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className={
                paragraph.emphasis
                  ? "max-w-[640px] border-l-2 border-faint pl-5 text-body text-text"
                  : "max-w-[640px] whitespace-pre-line text-body text-dim"
              }
            >
              {t(paragraph.text, locale)}
            </p>
          ))}
        </div>

        {next &&
          (nextExternal ? (
            // Still a case study, just hosted elsewhere — it replaces the page
            // like every other case link rather than opening a second tab.
            <a
              href={next.href}
              className="mt-12 inline-flex min-h-[43px] items-center justify-center rounded-full bg-text px-8 py-2 type-label text-bg transition-transform hover:scale-105"
            >
              {t(next.label, locale)} →
            </a>
          ) : (
            <Link
              href={`/${locale}${next.href}`}
              className="mt-12 inline-flex min-h-[43px] items-center justify-center rounded-full bg-text px-8 py-2 type-label text-bg transition-transform hover:scale-105"
            >
              {t(next.label, locale)} →
            </Link>
          ))}
      </section>
    </article>
  );
}
