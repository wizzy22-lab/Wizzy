import { getProject } from "./projects";

/**
 * The twelve cards in the hero carousel.
 *
 * A card with no `image` yet is an empty dashed frame — nothing is drawn
 * inside a card, so a card without artwork is blank. `image` is the slot that
 * ends that; when a file lands at the reserved path the card draws it instead
 * of the frame, and nothing else about the carousel changes.
 *
 * The first three point at cases that already exist. `slug` rather than a URL,
 * because `projects.ts` already knows where each case lives — writing the
 * destination twice is how the two drift apart. The rest have nowhere to go
 * yet and render inert.
 *
 * Labels are never drawn — they are the accessible name of a card that can be
 * opened, and a note to ourselves about what artwork belongs in the slot — so
 * they stay out of the dictionaries.
 *
 * The first three run in the same order and carry the same numbers as the
 * project section, so a card here and the row it opens are the same 01, 02, 03.
 */
export type HeroCard = {
  /** Position in the carousel. Not the project's own number. */
  no: string;
  /** The card's accessible name. Not drawn — see the note above. */
  label: string;
  /** Case this card opens, looked up in `projects.ts`. `null` renders inert. */
  slug: string | null;
  /** Reserved artwork — `hero-card-01` through `-12`. `null` keeps the frame. */
  image: string | null;
};

export const HERO_CARDS: HeroCard[] = [
  { no: "01", label: "SSP", slug: "shoot-shoot-penguin", image: null },
  { no: "02", label: "BingX", slug: "bingx", image: null },
  { no: "03", label: "Operator", slug: "operator", image: null },
  { no: "04", label: "Brand", slug: null, image: "/hero/hero-card-04.webp" },
  { no: "05", label: "Wireframe", slug: null, image: null },
  { no: "06", label: "Screens", slug: null, image: null },
  { no: "07", label: "Flow", slug: null, image: null },
  { no: "08", label: "System", slug: null, image: "/hero/hero-card-08.webp" },
  { no: "09", label: "Research", slug: null, image: null },
  { no: "10", label: "Prototype", slug: null, image: null },
  { no: "11", label: "Motion", slug: null, image: null },
  { no: "12", label: "Handoff", slug: null, image: null },
];

/** A hero card with its destination resolved — plain strings for the client. */
export type ResolvedHeroCard = {
  no: string;
  label: string;
  image: string | null;
  /** `null` when there is nothing to open yet. */
  href: string | null;
  /** `href` points off-site — a plain anchor rather than `<Link>`. */
  external: boolean;
};

/**
 * Resolves each card's destination for a given locale.
 *
 * Same rule the project accordion uses: an off-site case study is still this
 * portfolio's work, so it opens in the same tab, and a card with nothing to
 * open gets `null` rather than a link to a placeholder page.
 */
export function resolveHeroCards(lang: string): ResolvedHeroCard[] {
  return HERO_CARDS.map((card) => {
    const project = card.slug ? getProject(card.slug) : undefined;
    const href =
      project?.externalUrl ??
      (project?.hasCaseStudy ? `/${lang}/projects/${project.slug}` : null);

    return {
      no: card.no,
      label: card.label,
      image: card.image,
      href,
      external: Boolean(project?.externalUrl),
    };
  });
}
