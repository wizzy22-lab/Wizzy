import type { Localized } from "@/lib/i18n";

/**
 * Content shape for a business mini case (Wizzy Bakeshop, BingX, …).
 *
 * Deliberately narrower than `case-studies/types.ts`: those pages replay the
 * legacy site's free-form block list, while a mini case is always the same four
 * sections. Fixing the shape here is what lets `BusinessCasePage` stay a
 * template — every field below is copy or an asset path, never layout.
 *
 * Every string is `Localized`, so a case is authored once and renders in both
 * locales through `t()`.
 */

export type BusinessCaseMeta = {
  /** "Role", "Scope", "Duration" — rendered as the hero's meta row. */
  label: Localized;
  value: Localized;
};

export type BusinessCasePhoto = {
  /**
   * Path under `public/`. `resolvePhotos()` nulls it out when the file isn't
   * in the repo yet, and the template draws an empty slot in its place.
   */
  src: string | null;
  alt: Localized;
  /** Omit when the block carries one caption for the whole grid instead. */
  caption?: Localized;
};

/**
 * Frame proportion for a photo grid, matched to how the photos were shot —
 * every frame in a block shares one ratio so the grid stays on a single
 * baseline. Square for product shots, portrait for posters and store photos.
 */
export type BusinessCasePhotoRatio = "landscape" | "square" | "portrait";

/**
 * A looping clip. Autoplays muted and inline, so it reads as a moving still
 * rather than as a player — no controls, no sound, nothing to press.
 */
export type BusinessCaseVideo = {
  /** Path under `public/`, same null rule as `BusinessCasePhoto.src`. */
  src: string | null;
  /** Still held before the first frame decodes; same null rule again. */
  poster: string | null;
  alt: Localized;
  caption?: Localized;
};

/**
 * A captioned photo grid, optionally led by a clip. Every block on every case
 * page renders through one component, so radius, gap, and frame are identical
 * wherever a block appears — only the ratio and column count vary.
 */
export type BusinessCasePhotoBlock = {
  title: Localized;
  intro?: Localized;
  photos: BusinessCasePhoto[];
  /**
   * Leads the block, above the grid — for a set that starts with something in
   * motion and continues as stills.
   */
  video?: BusinessCaseVideo;
  /** Grid width on large screens. Defaults to 3. */
  columns?: 1 | 2 | 3;
  /** Defaults to landscape (4:3). */
  ratio?: BusinessCasePhotoRatio;
  /**
   * Caption treatment. `"label"` is the mono tag used where a caption names
   * the photo in a few words; the default reads as running text, for captions
   * that carry a sentence of their own.
   */
  captions?: "body" | "label";
  /**
   * One caption under the whole grid, for a set where per-photo captions would
   * just repeat each other. Photos in such a block leave `caption` unset.
   */
  caption?: Localized;
};

/**
 * One beat of a case card. The label is per-card rather than fixed by the
 * template: the four-beat rhythm is the constant, but a card about a failure
 * moves through situation → reality → experiment → lesson, not
 * observation → judgment → action → result.
 */
export type BusinessCaseStep = {
  label: Localized;
  body: Localized;
};

export type BusinessCaseCard = {
  /** Card sub-heading — what this particular case was about. */
  title: Localized;
  /** Four beats, in narrative order. The last one reads as the payoff. */
  steps: BusinessCaseStep[];
};

export type BusinessCase = {
  slug: string;

  /** ① Hero — title, subtitle, meta row, one headline fact, wide image. */
  hero: {
    title: Localized;
    subtitle: Localized;
    meta: BusinessCaseMeta[];
    /** The single number worth remembering, set large. */
    keyFact: { value: Localized; label: Localized };
    /** Optional lead paragraph, below the key fact. */
    lead?: Localized;
    /**
     * `src` follows the same rule as `BusinessCasePhoto.src`. The frame is a
     * 16:9 band by default; a photo shot square sets `"square"` and gets a
     * narrower centred frame instead of being cropped to a letterbox.
     */
    image: {
      src: string | null;
      alt: Localized;
      ratio?: "wide" | "square";
    } | null;
  };

  /**
   * ② Photo blocks between the hero and the cases, rendered in order — the
   * products, the brand graphics, whatever the case is showing before it
   * starts explaining.
   */
  blocks?: BusinessCasePhotoBlock[];

  /** ③ Cases — two or three cards, each in the four-beat structure. */
  cases: {
    title: Localized;
    intro?: Localized;
    items: BusinessCaseCard[];
    /** A shorter aside that doesn't warrant the full four beats. */
    note?: { title: Localized; body: Localized };
  };

  /**
   * ③b Photo blocks after the cases, rendered in order — evidence for the
   * stories just told, which is why they sit below rather than above them.
   */
  closingBlocks?: BusinessCasePhotoBlock[];

  /** ④ Takeaway — closing paragraphs and the cross-link to the next case. */
  takeaway: {
    title: Localized;
    /** Rendered in order; `emphasis` pulls a paragraph out with a side rule. */
    paragraphs: { text: Localized; emphasis?: boolean }[];
    /**
     * Cross-link to another case. `href` is locale-agnostic — an in-app path
     * like `/projects/bingx` gets the current locale prefixed automatically;
     * an absolute `http(s)` URL is used as-is. Either way the link opens in the
     * same tab — it is another case study, not an outside service. `null`
     * renders no button.
     */
    next: { href: string; label: Localized } | null;
  };
};
