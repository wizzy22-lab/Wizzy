"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_LABEL, type Locale } from "@/lib/i18n";

/**
 * Swaps the leading locale segment of the current path, so switching language
 * keeps the visitor on the same page (/en/projects/operator → /ko/projects/operator).
 */
function pathForLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  segments[0] = locale; // segment 0 is always the locale under app/[lang]
  return `/${segments.join("/")}`;
}

export default function LangToggle({ current }: { current: Locale }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 text-sm">
      {LOCALES.map((locale, i) => (
        <span key={locale} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden className="text-muted/40">
              /
            </span>
          )}
          {locale === current ? (
            <span aria-current="true" className="text-accent">
              {LOCALE_LABEL[locale]}
            </span>
          ) : (
            <Link
              href={pathForLocale(pathname, locale)}
              hrefLang={locale}
              className="text-muted transition-opacity hover:opacity-70"
            >
              {LOCALE_LABEL[locale]}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
