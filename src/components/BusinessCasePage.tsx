import Image from "next/image";
import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";
import type { BusinessCase } from "@/content/business-cases";

/**
 * Shared template for the business mini cases.
 *
 * Everything renders from the injected `BusinessCase` — the component owns
 * layout and nothing else, so a new case is a data file, not a new page.
 * Four sections, always in this order: Hero, What I Built, Cases, Takeaway.
 *
 * Styling stays on the main page's tokens (`accent`, `sky`, `muted`, the serif
 * display face, the `rounded-2xl/3xl` scale). No new colours or fonts: `accent`
 * is the one highlight, used for the display headings, the key fact, each
 * card's closing beat, the rule beside an emphasised paragraph, and the button.
 *
 * The site header is intentionally not included — mount it in the route
 * alongside this component, the way `projects/[slug]/page.tsx` does.
 */

// Tailwind needs the full class name in the source, so both grid widths are
// spelled out rather than composed from the `columns` value.
const GRID_COLUMNS: Record<2 | 3, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
};

const GRID_SIZES: Record<2 | 3, string> = {
  2: "(max-width: 640px) 100vw, 520px",
  3: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px",
};

/**
 * Stand-in for a photo that isn't in the repo yet. Same dashed language the
 * main page uses for an unfilled slot, so a case reads as in-progress rather
 * than broken.
 */
function EmptySlot({ ratio }: { ratio: string }) {
  return (
    <div
      className={`flex ${ratio} items-center justify-center rounded-2xl border border-dashed border-border bg-surface`}
    >
      <span className="type-label text-dim">PHOTO</span>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className=" text-heading text-accent">
      {children}
    </h2>
  );
}

export default function BusinessCasePage({
  data,
  locale,
}: {
  data: BusinessCase;
  locale: Locale;
}) {
  const { hero, built, cases, takeaway } = data;
  const columns = built.columns ?? 3;
  const next = takeaway.next;
  // An absolute URL points off-site; anything else is an in-app path that still
  // needs the current locale segment.
  const nextExternal = next ? /^https?:\/\//.test(next.href) : false;

  return (
    <article className="mx-auto w-full max-w-[1100px] px-6 pb-32 pt-[140px] md:px-10">
      {/* ① Hero */}
      <header>
        <h1 className="max-w-[900px] text-display text-accent">
          {t(hero.title, locale)}
        </h1>

        <p className="mt-6 max-w-[820px] whitespace-pre-line text-body text-dim">
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
          <p className=" text-heading text-accent">
            {t(hero.keyFact.value, locale)}
          </p>
          <p className="mt-3 type-label text-dim">
            {t(hero.keyFact.label, locale)}
          </p>
        </div>

        {hero.lead && (
          <p className="mt-10 max-w-[820px] whitespace-pre-line text-body text-dim">
            {t(hero.lead, locale)}
          </p>
        )}

        {hero.image &&
          (hero.image.src ? (
            <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-surface">
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
              <EmptySlot ratio="aspect-[16/9]" />
            </div>
          ))}
      </header>

      {/* ② What I Built */}
      {built.photos.length > 0 && (
        <section className="mt-28 scroll-mt-[120px]" id="built">
          <SectionHeading>{t(built.title, locale)}</SectionHeading>

          {built.intro && (
            <p className="mt-6 max-w-[820px] whitespace-pre-line text-body text-dim">
              {t(built.intro, locale)}
            </p>
          )}

          <div className={`mt-10 grid gap-x-6 gap-y-10 ${GRID_COLUMNS[columns]}`}>
            {built.photos.map((photo, i) => (
              <figure key={i}>
                {photo.src ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface">
                    <Image
                      src={photo.src}
                      alt={t(photo.alt, locale)}
                      fill
                      sizes={GRID_SIZES[columns]}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <EmptySlot ratio="aspect-[4/3]" />
                )}
                <figcaption className="mt-3 text-body text-dim">
                  {t(photo.caption, locale)}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ③ Cases */}
      {cases.items.length > 0 && (
        <section className="mt-28 scroll-mt-[120px]" id="cases">
          <SectionHeading>{t(cases.title, locale)}</SectionHeading>

          {cases.intro && (
            <p className="mt-6 max-w-[820px] whitespace-pre-line text-body text-dim">
              {t(cases.intro, locale)}
            </p>
          )}

          <div className="mt-10 flex flex-col gap-8">
            {cases.items.map((item, i) => (
              <div
                key={i}
                className="rounded-3xl border border-border bg-surface p-8 md:p-10"
              >
                <p className=" text-heading text-accent/70">
                  {String(i + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-4 max-w-[860px] text-heading text-text">
                  {t(item.title, locale)}
                </h3>

                <dl className="mt-8 flex flex-col gap-6">
                  {item.steps.map((step, si) => {
                    // The last beat is the payoff — result, lesson, whatever the
                    // card lands on — so it carries the accent.
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
                          className={`max-w-[720px] whitespace-pre-line text-body ${
                            closing ? "text-accent" : "text-text"
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
            <div className="mt-8 rounded-2xl border border-border bg-surface p-8">
              <h3 className="type-label text-dim">
                {t(cases.note.title, locale)}
              </h3>
              <p className="mt-4 max-w-[820px] whitespace-pre-line text-body text-text">
                {t(cases.note.body, locale)}
              </p>
            </div>
          )}
        </section>
      )}

      {/* ④ Takeaway */}
      <section className="mt-28 scroll-mt-[120px]" id="takeaway">
        <SectionHeading>{t(takeaway.title, locale)}</SectionHeading>

        <div className="mt-6 flex flex-col gap-6">
          {takeaway.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className={
                paragraph.emphasis
                  ? "max-w-[820px] border-l-2 border-accent/60 pl-5 text-body text-text"
                  : "max-w-[820px] whitespace-pre-line text-body text-dim"
              }
            >
              {t(paragraph.text, locale)}
            </p>
          ))}
        </div>

        {next &&
          (nextExternal ? (
            <a
              href={next.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-12 inline-flex min-h-[43px] items-center justify-center rounded-full bg-accent px-8 py-2 type-label text-accent-ink transition-transform hover:scale-105"
            >
              {t(next.label, locale)} →
            </a>
          ) : (
            <Link
              href={`/${locale}${next.href}`}
              className="mt-12 inline-flex min-h-[43px] items-center justify-center rounded-full bg-accent px-8 py-2 type-label text-accent-ink transition-transform hover:scale-105"
            >
              {t(next.label, locale)} →
            </Link>
          ))}
      </section>
    </article>
  );
}
