import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCALES, hasLocale, t } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionaries";
import { PROJECTS, getProject } from "@/content/projects";
import { getCaseStudy } from "@/content/case-studies";
import SiteHeader from "@/components/SiteHeader";
import CaseStudyBody from "@/components/CaseStudyBody";

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => PROJECTS.map((project) => ({ lang, slug: project.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(lang) || !project) return {};

  return {
    title: `${project.name} — Wizzy`,
    description: t(project.subtitle, lang),
    alternates: {
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/projects/${slug}`])),
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const project = getProject(slug);
  if (!project) notFound();

  const dict = await getDictionary(lang);
  const caseStudy = getCaseStudy(slug);

  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <main className="relative min-h-screen w-full bg-background font-sans">
      <SiteHeader lang={lang} dict={dict} />

      <div className="mx-auto w-full max-w-[1100px] px-6 pb-32 pt-[140px] md:px-10">
        <Link
          href={`/${lang}#project`}
          className="text-sm text-sky transition-opacity hover:opacity-70"
        >
          ← {dict.caseStudy.back}
        </Link>

        {/* Hero */}
        <header className="mt-10">
          <p className="text-sm uppercase tracking-[0.16em] text-sky">
            {caseStudy ? t(caseStudy.hero.tag, lang) : t(project.subtitle, lang)}
          </p>

          <h1 className="mt-5 max-w-[900px] font-serif text-[clamp(32px,4vw,60px)] leading-[1.2] tracking-[-0.04em] text-accent">
            {caseStudy ? t(caseStudy.hero.headline, lang) : project.name}
          </h1>

          <p className="mt-6 max-w-[820px] text-lg leading-[1.6] text-muted">
            {caseStudy ? t(caseStudy.hero.description, lang) : t(project.description, lang)}
          </p>

          {caseStudy && caseStudy.hero.meta.length > 0 && (
            <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-8 md:grid-cols-5">
              {caseStudy.hero.meta.map((item, i) => (
                <div key={i}>
                  <dt className="text-xs uppercase tracking-[0.14em] text-muted/70">
                    {t(item.label, lang)}
                  </dt>
                  <dd className="mt-2 whitespace-pre-line text-sm leading-[1.5] text-white/85">
                    {t(item.value, lang)}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {caseStudy?.hero.image && (
            <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <Image
                src={caseStudy.hero.image}
                alt={project.name}
                width={1600}
                height={1000}
                priority
                sizes="(max-width: 1100px) 100vw, 1040px"
                className="h-auto w-full object-contain"
              />
            </div>
          )}
        </header>

        {/* Body */}
        {caseStudy ? (
          <div className="mt-10">
            <CaseStudyBody caseStudy={caseStudy} locale={lang} />
          </div>
        ) : (
          <div className="mt-16 rounded-2xl border border-dashed border-white/15 bg-white/5 p-10">
            <h2 className="font-serif text-2xl tracking-[-0.03em] text-accent">
              {dict.caseStudy.inProgress.title}
            </h2>
            <p className="mt-3 max-w-[640px] text-lg leading-[1.6] text-muted">
              {dict.caseStudy.inProgress.body}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex h-10 items-center rounded-full border border-sky/50 px-4 text-base text-sky"
                >
                  {t(tag, lang)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Next project */}
        <nav className="mt-28 border-t border-white/10 pt-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted/70">
            {dict.caseStudy.nextProject}
          </p>
          <Link
            href={`/${lang}/projects/${next.slug}`}
            className="group mt-4 flex items-baseline gap-4"
          >
            <span className="font-serif text-[clamp(26px,3vw,44px)] tracking-[-0.04em] text-accent">
              {next.no}. {next.name}
            </span>
            <span className="text-2xl text-sky transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
