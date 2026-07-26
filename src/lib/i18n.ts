export const LOCALES = ["en", "ko"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** The language a visitor switches to from the one they're on. */
export const OTHER_LOCALE: Record<Locale, Locale> = { en: "ko", ko: "en" };

/** Label shown on the header toggle. */
export const LOCALE_LABEL: Record<Locale, string> = { en: "EN", ko: "KO" };

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * A string that exists in both languages.
 *
 * `ko` is optional because auto-generated content (see `src/content/case-studies`)
 * can be missing a translation; `t()` then falls back to English rather than
 * rendering an empty node.
 */
export type Localized = { en: string; ko?: string };

export function t(value: Localized, locale: Locale): string {
  return (locale === "ko" ? value.ko : value.en) ?? value.en;
}
