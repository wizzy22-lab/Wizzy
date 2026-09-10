import { getProject } from "./projects";

/**
 * The seven cards in the hero carousel.
 *
 * Every card carries artwork. It was twelve while five of them were still
 * empty dashed frames waiting for a file; a frame with nothing in it reads as
 * a gap in the arc rather than a promise, so the five went. A card added back
 * later still renders the frame until its `image` lands — that path is intact,
 * it is simply not in use.
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
  /**
   * Identifies the card, and names its artwork file. Not a position: the
   * numbers stopped being contiguous when the five empty cards were removed,
   * and they stay as they are so each one still points at its own
   * `hero-card-NN.webp`. Not the project's own number either.
   */
  no: string;
  /** The card's accessible name. Not drawn — see the note above. */
  label: string;
  /** Case this card opens, looked up in `projects.ts`. `null` renders inert. */
  slug: string | null;
  /** Artwork at `/hero/hero-card-<no>.webp`. `null` would keep the frame. */
  image: string | null;
};

export const HERO_CARDS: HeroCard[] = [
  {
    no: "01",
    label: "SSP",
    slug: "shoot-shoot-penguin",
    image: "/hero/hero-card-01.webp",
  },
  { no: "02", label: "BingX", slug: "bingx", image: "/hero/hero-card-02.webp" },
  {
    no: "03",
    label: "Operator",
    slug: "operator",
    image: "/hero/hero-card-03.webp",
  },
  { no: "04", label: "Brand", slug: null, image: "/hero/hero-card-04.webp" },
  { no: "06", label: "Screens", slug: null, image: "/hero/hero-card-06.webp" },
  { no: "08", label: "System", slug: null, image: "/hero/hero-card-08.webp" },
  {
    no: "10",
    label: "Prototype",
    slug: null,
    image: "/hero/hero-card-10.webp",
  },
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
