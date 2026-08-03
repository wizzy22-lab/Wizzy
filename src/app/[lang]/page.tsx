import { notFound } from "next/navigation";
import { hasLocale, t } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionaries";
import { PROJECT_CARDS, BUSINESS_CARDS } from "@/content/projects";
import SiteHeader from "@/components/SiteHeader";
import RotatingHeadline from "@/components/RotatingHeadline";
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

  // Resolve to plain strings here so the client accordion never imports a dictionary.
  const cards: ProjectCard[] = PROJECT_CARDS.map((project) => ({
    slug: project.slug,
    no: project.no,
    name: project.name,
    subtitle: t(project.subtitle, lang),
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

  // Same shape, interaction, and linking rule as the project accordion — a card
  // without a case study still renders inert.
  const businessCards: ProjectCard[] = BUSINESS_CARDS.map((project) => ({
    slug: project.slug,
    no: project.no,
    name: project.name,
    subtitle: t(project.subtitle, lang),
    tags: project.tags.map((tag) => t(tag, lang)),
    description: t(project.description, lang),
    thumbnail: project.thumbnail,
    href: project.externalUrl ?? (project.hasCaseStudy ? `/${lang}/projects/${project.slug}` : null),
    external: Boolean(project.externalUrl),
    cta: project.hasCaseStudy || project.externalUrl ? dict.projects.viewCase : null,
  }));

  return (
    <main className="relative min-h-screen w-full bg-bg font-sans">
      <SiteHeader lang={lang} dict={dict} />

      {/*
        80vh, not 100 — the remaining fifth of the first screen belongs to the
        section below, so the light band under the fold reads as "keep going".
        The space the portrait used to occupy is left empty on purpose.
      */}
      <div
        data-theme="dark"
        className="mx-auto flex min-h-[80vh] w-full max-w-[1920px] flex-col overflow-hidden px-6 pt-[70px] md:px-16 xl:px-[180px] 2xl:px-[360px]"
      >
        {/* Hero */}
        <section className="relative flex flex-1 flex-col items-center justify-center pb-24 text-center">
          {dict.hero.eyebrow && (
            <p className="type-label text-dim">{dict.hero.eyebrow}</p>
          )}

          <RotatingHeadline phrases={dict.hero.phrases} />

          <p className="mt-2 text-body text-dim">
            {dict.hero.tail.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>

          {/*
            Scroll hint — the only affordance left in the hero. Presence comes
            from the motion, not from size: the type stays at label scale and
            the box only grows to meet the 44px touch minimum.
          */}
          <a
            href="#project"
            className="type-label absolute bottom-0 left-1/2 inline-flex min-h-[44px] min-w-[44px] -translate-x-1/2 flex-col items-center justify-end gap-1 text-dim transition-opacity hover:opacity-70"
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

      <ProjectSection
        id="project"
        theme="light"
        label={dict.projects.label}
        projects={cards}
      />
      <ProjectSection
        id="business"
        theme="dark"
        label={dict.businessBrand.label}
        projects={businessCards}
      />
      <HowIGotHereSection dict={dict} />
      <SiteFooter lang={lang} dict={dict} />
    </main>
  );
}
