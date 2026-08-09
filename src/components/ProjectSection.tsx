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
  outcome: string;
  tags: string[];
  description: string;
  thumbnail: string | null;
  /** `null` when there is nothing to link to yet — the card renders inert. */
  href: string | null;
  /** `href` points off-site — render a plain anchor instead of `<Link>`. */
  external: boolean;
  /** `null` alongside a null `href` — the card shows no button at all. */
  cta: string | null;
};

type CardLinkProps = {
  href: string | null;
  external: boolean;
  tabIndex?: number;
  className?: string;
  "aria-hidden"?: boolean;
  children: React.ReactNode;
};

/**
 * `<Link>` for in-app routes, plain `<a>` for external case studies, and a
 * non-interactive `<span>` when there is no destination — deliberately not an
 * `<a href="#">`, which would be a dead link.
 *
 * Off-site case studies are still this portfolio's work, so they load in the
 * same tab. Only genuinely third-party destinations (the CV file, social
 * profiles) get `target="_blank"`.
 */
function CardLink({ href, external, children, tabIndex, ...rest }: CardLinkProps) {
  // No `tabIndex` on the inert branch — nothing here should take focus.
  if (href === null) {
    return (
      <span aria-disabled="true" {...rest}>
        {children}
      </span>
    );
  }
  if (external) {
    return (
      <a href={href} tabIndex={tabIndex} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} tabIndex={tabIndex} {...rest}>
      {children}
    </Link>
  );
}

export default function ProjectSection({
  id,
  label,
  projects,
  theme = "dark",
}: {
  /** Anchor target — each instance on the page needs its own. */
  id: string;
  label: string;
  projects: ProjectCard[];
  /** Which token set the section paints with. */
  theme?: "dark" | "light";
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
      id={id}
      ref={outerRef}
      data-theme={theme}
      className="relative w-full bg-bg font-sans"
      style={{ height: `${count * 100}vh` }}
    >
      {/* Pinned viewport.
          The padding only ever shows on a short window: the panel is centred,
          so on a tall one the slack around it is already larger than any value
          here. It is kept low so the open card — down to its button — still
          clears `overflow-hidden` on a laptop-height viewport. */}
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-8">
        <div className="mx-auto w-full max-w-[1920px] px-6 md:px-16 xl:px-[180px] 2xl:px-[360px]">
          <p className="type-label text-center text-dim">{label}</p>

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
                      isOpen ? "pt-1" : "flex h-[72px] items-center border-t border-border"
                    }`}
                  >
                    {isOpen ? (
                      // Same number treatment as the collapsed row and the
                      // next-project link: the mono label carries it everywhere,
                      // so it never switches to heading type mid-page.
                      <span className="flex items-baseline text-text">
                        {/* Same 64px number column as the collapsed row, so the
                            numbers stay on one axis as rows open and close. */}
                        <span className="type-label w-16 shrink-0 text-dim">
                          {project.no}
                        </span>
                        <span className="text-heading font-medium">
                          {project.name}
                        </span>
                      </span>
                    ) : (
                      <span className="flex w-full items-center text-dim">
                        <span className="type-label w-16 shrink-0">
                          {project.no}
                        </span>
                        <span className="flex-1 text-center text-heading font-medium">
                          {project.name}
                        </span>
                        <span className="w-16 shrink-0 text-right text-heading font-medium transition-transform duration-300 group-hover:translate-x-1">
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
                          <p className="text-body text-dim">{project.subtitle}</p>

                          {/* The result, in one line. Same body size as the
                              subtitle and the paragraph below it — the only
                              thing that ranks it is brightness and weight, so
                              nothing new enters the type scale. `text-pretty`
                              keeps a single word off the last line without
                              touching the copy. */}
                          <p className="mt-3 text-pretty text-body font-medium text-text">
                            {project.outcome}
                          </p>

                          {/* Chips are one size and one shape; the only thing
                              that ranks them is colour. The first tag names the
                              discipline, so it carries full-strength text and
                              the rest sit a step down at `dim`. */}
                          <div className="mt-5 flex flex-wrap gap-3">
                            {project.tags.map((tag, ti) => (
                              <span
                                key={tag}
                                className={`type-label inline-flex h-10 items-center rounded-full border border-border px-4 ${
                                  ti === 0 ? "text-text" : "text-dim"
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <p className="mt-5 text-body text-dim">
                            {project.description}
                          </p>

                          {project.cta !== null && (
                            <CardLink
                              external={project.external}
                              href={project.href}
                              tabIndex={isOpen ? undefined : -1}
                              className="type-label mt-6 inline-flex h-11 w-fit items-center rounded-full bg-text px-6 text-bg transition-transform hover:scale-105"
                            >
                              {/* One arrow for both branches: an off-site case
                                  study now behaves exactly like an in-app one,
                                  so ↗ would promise a new tab it won't open. */}
                              {project.cta} →
                            </CardLink>
                          )}
                        </div>

                        {/* Right: cover. Always 1:1 — the art is square, and a
                            card with nothing on file keeps the same footprint
                            so the row doesn't reflow. The dashed outline is the
                            empty state alone; a real thumbnail fills the slot
                            edge to edge. */}
                        <CardLink
                          external={project.external}
                          href={project.href}
                          tabIndex={-1}
                          aria-hidden
                          className={`relative flex aspect-square h-[min(600px,42vh)] w-[min(600px,42vh)] max-w-full items-center justify-center overflow-hidden rounded-[var(--radius-card)] bg-surface ${
                            project.thumbnail ? "" : "border border-dashed border-border"
                          }`}
                        >
                          {project.thumbnail && (
                            <Image
                              src={project.thumbnail}
                              alt={`${project.name} app screens on device mockup`}
                              fill
                              sizes="(max-width: 1024px) 100vw, 600px"
                              className="object-cover"
                            />
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
