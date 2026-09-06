import { notFound } from "next/navigation";
import { hasLocale, t } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionaries";
import { PROJECT_CARDS } from "@/content/projects";
import { resolveHeroCards } from "@/content/hero-cards";
import SiteHeader from "@/components/SiteHeader";
import RotatingHeadline from "@/components/RotatingHeadline";
import HeroCarousel from "@/components/HeroCarousel";
import HeroIntro from "@/components/HeroIntro";
import ProjectSection, { type ProjectCard } from "@/components/ProjectSection";
import HowIGotHereSection from "@/components/HowIGotHereSection";
import SiteFooter from "@/components/SiteFooter";
// Testimonials are hidden for now — re-add <WordsFromPeopleSection dict={dict} />
// below the timeline to bring the section back. Component and copy are intact.
// import WordsFromPeopleSection from "@/components/WordsFromPeopleSection";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  // Destinations resolved here, so the client carousel never imports the
  // project list to look one up.
  const heroCards = resolveHeroCards(lang);

  // Resolve to plain strings here so the client accordion never imports a dictionary.
  const cards: ProjectCard[] = PROJECT_CARDS.map((project) => ({
    slug: project.slug,
    no: project.no,
    name: project.name,
    subtitle: t(project.subtitle, lang),
    outcome: t(project.outcome, lang),
    tags: project.tags.map((tag) => t(tag, lang)),
    description: t(project.description, lang),
    thumbnail: project.thumbnail,
    // Only link when there is something to read — a card with no case study
    // (written or hosted elsewhere) renders fully inert rather than pointing at
    // a placeholder page.
    href: project.externalUrl ?? (project.hasCaseStudy ? `/${lang}/projects/${project.slug}` : null),
    external: Boolean(project.externalUrl),
    cta: project.hasCaseStudy || project.externalUrl ? dict.projects.viewCase : null,
  }));

  return (
    <main className="relative min-h-screen w-full bg-bg font-sans">
      {/*
        Everything the intro hides has to sit under the element carrying its
        phase, so the intro wraps the page rather than sitting beside it. The
        children stay server components; only the wrapper and its plate cross
        to the client.
      */}
      <HeroIntro>
        <SiteHeader lang={lang} dict={dict} />

        {/*
          80vh, not 100 — the remaining fifth of the first screen belongs to the
          section below, so the light band under the fold reads as "keep going".
          The space the portrait used to occupy is left empty on purpose.
        */}
        <div
          data-theme="dark"
          // `hero-shell` is the intro's handle on this clip: the card it blows
          // up is taller than this band, and `overflow-hidden` would crop it to
          // a letterbox. Lifted for the intro, back after.
          className="hero-shell mx-auto flex min-h-[80vh] w-full max-w-[1920px] flex-col overflow-hidden px-6 pt-[70px] md:px-16 xl:px-[180px] 2xl:px-[360px]"
        >
          {/* Hero.

              `--intro-step` is set here rather than on each line: custom
              properties inherit, so the three parts of the headline share one
              beat of the intro's reveal and only the scroll hint below has to
              name a different one. */}
          <section
            style={{ "--intro-step": 1 } as React.CSSProperties}
            className="relative flex flex-1 flex-col items-center justify-center pb-24 text-center"
          >
            {dict.hero.eyebrow && (
              <p className="intro-reveal type-label text-dim">
                {dict.hero.eyebrow}
              </p>
            )}

            <RotatingHeadline phrases={dict.hero.phrases} className="intro-reveal" />

            <p className="intro-reveal mt-2 text-body text-dim">
              {dict.hero.tail.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>

            {/*
              The arc sits under the whole headline block, not between the
              rotating phrase and its tail — those two are one sentence, and
              anything dropped into the middle of it breaks the reading.
            */}
            <HeroCarousel cards={heroCards} label={dict.hero.carouselLabel} />

            {/*
              Scroll hint — the only affordance left in the hero. Presence comes
              from the motion, not from size: the type stays at label scale and
              the box only grows to meet the 44px touch minimum.
            */}
            <a
              href="#project"
              style={{ "--intro-step": 2 } as React.CSSProperties}
              className="intro-reveal type-label absolute bottom-0 left-1/2 inline-flex min-h-[44px] min-w-[44px] -translate-x-1/2 flex-col items-center justify-end gap-1 text-dim transition-opacity hover:opacity-70"
            >
              {dict.hero.scrollHint}
              <span
                aria-hidden
                className="animate-scroll-hint motion-reduce:animate-none"
              >
                ↓
              </span>
            </a>
          </section>
        </div>

        {/*
          One project section, not two.

          Business & Brand used to follow this one, which left the last thing a
          visitor read before about — and the last thing they carried away — as
          the bakery and the cafe rather than the product work. Real operating
          experience is the stronger story, and that was the problem: it buried
          three product cases under it. Those brands are now announced from the
          foot of about, where a history belongs, and this section closes on the
          design work it is there to argue for.
        */}
        <ProjectSection
          id="project"
          theme="light"
          label={dict.projects.label}
          projects={cards}
        />
        <HowIGotHereSection lang={lang} dict={dict} />
        <SiteFooter lang={lang} dict={dict} />
      </HeroIntro>
    </main>
  );
}
