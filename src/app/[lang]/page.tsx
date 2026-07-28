import { notFound } from "next/navigation";
import { hasLocale, t } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionaries";
import { PROJECT_CARDS, BUSINESS_CARDS } from "@/content/projects";
import SiteHeader from "@/components/SiteHeader";
import RotatingHeadline from "@/components/RotatingHeadline";
import ProjectSection, { type ProjectCard } from "@/components/ProjectSection";
import IntroduceSection from "@/components/IntroduceSection";
import HowIGotHereSection from "@/components/HowIGotHereSection";
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

  // Same shape and interaction as the project accordion; these two just have
  // nowhere to link yet, so `href` stays null and no CTA renders.
  const businessCards: ProjectCard[] = BUSINESS_CARDS.map((project) => ({
    slug: project.slug,
    no: project.no,
    name: project.name,
    subtitle: t(project.subtitle, lang),
    tags: project.tags.map((tag) => t(tag, lang)),
    description: t(project.description, lang),
    thumbnail: project.thumbnail,
    href: null,
    external: false,
    cta: null,
  }));

  return (
    <main className="relative min-h-screen w-full bg-background font-sans">
      <SiteHeader lang={lang} dict={dict} />

      <div className="mx-auto flex min-h-screen w-full max-w-[1920px] flex-col overflow-hidden px-6 pt-[99px] md:px-16 xl:px-[180px] 2xl:px-[360px]">
        {/* Hero */}
        <section className="relative flex flex-1 flex-col items-center justify-center pb-24 text-center">
          {dict.hero.eyebrow && (
            <p className="text-base tracking-[0.1em] text-muted md:text-xl">
              {dict.hero.eyebrow}
            </p>
          )}

          <RotatingHeadline phrases={dict.hero.phrases} />

          <p className="mt-2 text-base uppercase leading-[1.2] tracking-[0.06em] text-muted md:text-xl">
            {dict.hero.tail.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>

          {/* Photo placeholder — swap for the real cut-out portrait later */}
          <div className="mt-[72px] flex h-[410px] w-[300px] max-w-full items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5">
            <span className="text-sm tracking-[0.1em] text-muted">PHOTO</span>
          </div>

          {/* CONTACT button — bottom right of the hero */}
          <a
            href="#contact"
            className="absolute bottom-0 right-0 inline-flex h-[43px] items-center justify-center rounded-full bg-accent px-8 text-base tracking-[0.02em] text-foreground transition-transform hover:scale-105"
          >
            {dict.nav.contact}
          </a>
        </section>
      </div>

      <ProjectSection id="project" label={dict.projects.label} projects={cards} />
      <ProjectSection
        id="business"
        label={dict.businessBrand.label}
        projects={businessCards}
      />
      <IntroduceSection dict={dict} />
      <HowIGotHereSection dict={dict} />
    </main>
  );
}
