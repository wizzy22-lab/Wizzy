import type { Locale } from "@/lib/i18n";

/** The CV is written per language, so each locale serves its own file. */
export const RESUME_PDF: Record<Locale, string> = {
  en: "/HaejiWi_ProductDesigner_Resume_EN.pdf",
  ko: "/HaejiWi_ProductDesigner_Resume_KO.pdf",
};

export const EMAIL = "hazzysw@gmail.com";

/**
 * Social profiles, in render order. Empty on purpose — no profile URL exists in
 * the project yet, and the footer drops its "Connect" column entirely rather
 * than showing a heading with nothing under it. Add an entry to bring it back.
 */
export const SOCIAL_LINKS: { label: string; href: string }[] = [];
