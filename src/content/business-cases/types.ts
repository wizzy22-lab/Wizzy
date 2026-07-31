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
  src: string;
  alt: Localized;
  caption: Localized;
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
    image: { src: string; alt: Localized } | null;
  };

  /** ② What I Built — captioned 4:3 photo grid. */
  built: {
    title: Localized;
    intro?: Localized;
    photos: BusinessCasePhoto[];
    /** Grid width on large screens. Defaults to 3. */
    columns?: 2 | 3;
  };

  /** ③ Cases — two or three cards, each in the four-beat structure. */
  cases: {
    title: Localized;
    intro?: Localized;
    items: BusinessCaseCard[];
    /** A shorter aside that doesn't warrant the full four beats. */
    note?: { title: Localized; body: Localized };
  };

  /** ④ Takeaway — closing paragraphs and the cross-link to the next case. */
  takeaway: {
    title: Localized;
    /** Rendered in order; `emphasis` pulls a paragraph out with an accent rule. */
    paragraphs: { text: Localized; emphasis?: boolean }[];
    /**
     * Cross-link to another case. `href` is locale-agnostic — an in-app path
     * like `/projects/bingx` gets the current locale prefixed automatically;
     * an absolute `http(s)` URL opens in a new tab. `null` renders no button.
     */
    next: { href: string; label: Localized } | null;
  };
};
