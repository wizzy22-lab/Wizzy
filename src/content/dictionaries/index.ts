import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "./en";

const dictionaries = {
  en: () => import("./en").then((m) => m.default),
  ko: () => import("./ko").then((m) => m.default),
};

/**
 * Loaded in Server Components, so translation files never reach the client
 * bundle — only the resolved strings a page actually renders do.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

export type { Dictionary };
