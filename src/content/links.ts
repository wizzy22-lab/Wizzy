import type { Locale } from "@/lib/i18n";

/** The CV is written per language, so each locale serves its own file. */
export const RESUME_PDF: Record<Locale, string> = {
  en: "/HaejiWi_ProductDesigner_Resume_EN.pdf",
  ko: "/HaejiWi_ProductDesigner_Resume_KO.pdf",
};

export const EMAIL = "hazzysw@gmail.com";

/**
 * Social profiles, in render order — the footer's "Connect" column. Genuinely
 * third-party destinations, so these are the links that keep `target="_blank"`.
 * The column disappears entirely if this list is emptied.
 */
export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/haeji-wi" },
];
