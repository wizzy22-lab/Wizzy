import { getProject } from "./projects";

/**
 * The six cards in the hero carousel.
 *
 * Stage one: every card is a placeholder — a dashed frame with a mono label
 * where the artwork will go. `image` is the slot that ends that; when a file
 * lands at the reserved path the card draws it instead of the frame, and
 * nothing else about the carousel changes.
 *
 * The first three point at cases that already exist. `slug` rather than a URL,
 * because `projects.ts` already knows where each case lives — writing the
 * destination twice is how the two drift apart. The last three have nowhere to
 * go yet and render inert.
 *
 * Labels are placeholder codes in the mono face, so they stay out of the
 * dictionaries: `SSP` and `BingX` are proper nouns either way, and `Brand` /
 * `Wireframe` / `Screens` are notes to ourselves that the artwork replaces.
 */
export type HeroCard = {
  /** Position in the carousel. Not the project's own number. */
  no: string;
  /** What the placeholder says, after the number. */
  label: string;
  /** Case this card opens, looked up in `projects.ts`. `null` renders inert. */
  slug: string | null;
  /** Reserved artwork. `null` keeps the dashed placeholder. */
  image: string | null;
};

export const HERO_CARDS: HeroCard[] = [
  { no: "01", label: "SSP", slug: "shoot-shoot-penguin", image: null },
  { no: "02", label: "Operator", slug: "operator", image: null },
  { no: "03", label: "BingX", slug: "bingx", image: null },
  { no: "04", label: "Brand", slug: null, image: null },
  { no: "05", label: "Wireframe", slug: null, image: null },
  { no: "06", label: "Screens", slug: null, image: null },
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
