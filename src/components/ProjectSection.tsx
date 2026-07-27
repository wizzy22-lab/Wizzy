"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

/** Locale-resolved project card — plain strings so it crosses the server boundary. */
export type ProjectCard = {
  slug: string;
  no: string;
  name: string;
  subtitle: string;
  tags: string[];
  description: string;
  thumbnail: string | null;
  href: string;
  /** `href` points off-site — render a plain anchor that opens in a new tab. */
  external: boolean;
  cta: string;
};

/** `<Link>` for in-app routes, plain `<a>` for external case studies. */
function CardLink({
  external,
  href,
  children,
  ...rest
}: { external: boolean } & React.ComponentProps<typeof Link>) {
  if (external) {
    return (
      <a href={String(href)} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}

export default function ProjectSection({
  label,
  projects,
}: {
  label: string;
  projects: ProjectCard[];
}) {
  const [openIndex, setOpenIndex] = useState(0);
  const baseId = useId();
  const outerRef = useRef<HTMLElement | null>(null);
  const count = projects.length;

  // Scroll-driven accordion (scrollytelling):
  // the tall outer section provides scroll distance; the inner panel is pinned (sticky).
  // openIndex = which slice of the section's scroll progress we're in → every item is reachable,
  // and items expand/collapse in place with no layout jump.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = outerRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight; // scrollable distance inside the section
      if (total <= 0) return;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), total);
      const idx = Math.min(count - 1, Math.floor((scrolled / total) * count));
      setOpenIndex((prev) => (prev === idx ? prev : idx));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count]);

  // Clicking a header scrolls to the middle of that project's scroll slice.
  const scrollToIndex = (i: number) => {
    const el = outerRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const docTop = el.getBoundingClientRect().top + window.scrollY;
    const target = docTop + ((i + 0.5) / count) * total;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section
      id="project"
      ref={outerRef}
      className="relative w-full bg-background font-sans"
      style={{ height: `${count * 100}vh` }}
    >
      {/* Pinned viewport */}
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-16">
        <div className="mx-auto w-full max-w-[1920px] px-6 md:px-16 xl:px-[180px] 2xl:px-[360px]">
          <p className="text-center text-2xl text-sky">{label}</p>

          <div className="mt-10">
            {projects.map((project, i) => {
              const isOpen = i === openIndex;
              const panelId = `${baseId}-panel-${i}`;
              const headerId = `${baseId}-header-${i}`;

              return (
                <div key={project.slug}>
                  {/* Header / toggle */}
                  <button
                    id={headerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => scrollToIndex(i)}
                    className={`group block w-full cursor-pointer text-left ${
                      isOpen ? "pt-1" : "flex h-[72px] items-center border-t border-white/10"
                    }`}
                  >
                    {isOpen ? (
                      <span className="font-bold tracking-[-0.05em] text-[clamp(28px,2.5vw,48px)] text-accent">
                        {project.no}.{project.name}
                      </span>
                    ) : (
                      <span className="flex w-full items-center text-sky">
                        <span className="w-16 shrink-0 text-lg font-bold tracking-[-0.05em]">
                          {project.no}
                        </span>
                        <span className="flex-1 text-center font-bold tracking-[-0.05em] text-[clamp(20px,2vw,32px)]">
                          {project.name}
                        </span>
                        <span className="w-16 shrink-0 text-right text-[clamp(20px,2vw,32px)] font-bold transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    )}
                  </button>

                  {/* Collapsible detail panel */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headerId}
                    className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={`flex flex-col gap-10 py-6 transition-opacity duration-500 lg:flex-row lg:items-start lg:justify-between motion-reduce:transition-none ${
                          isOpen ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {/* Left: text content */}
                        <div className="lg:max-w-[460px]">
                          <p className="text-lg text-muted">{project.subtitle}</p>

                          <div className="mt-5 flex flex-wrap gap-3">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex h-10 items-center rounded-full border border-sky/50 px-4 text-base text-sky"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <p className="mt-5 text-lg leading-[1.5] text-muted">
                            {project.description}
                          </p>

                          <CardLink
                            external={project.external}
                            href={project.href}
                            tabIndex={isOpen ? undefined : -1}
                            className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-6 text-base text-foreground transition-transform hover:scale-105"
                          >
                            {project.cta} {project.external ? "↗" : "→"}
                          </CardLink>
                        </div>

                        {/* Right: cover */}
                        <CardLink
                          external={project.external}
                          href={project.href}
                          tabIndex={-1}
                          aria-hidden
                          className="relative flex aspect-square h-[min(600px,42vh)] w-[min(600px,42vh)] max-w-full items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 bg-white/5"
                        >
                          {project.thumbnail ? (
                            <Image
                              src={project.thumbnail}
                              alt=""
                              fill
                              sizes="(max-width: 1024px) 100vw, 600px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-sm tracking-[0.1em] text-muted">MOCKUP</span>
                          )}
                        </CardLink>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
