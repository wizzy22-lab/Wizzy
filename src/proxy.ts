import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";

/**
 * Every page lives under /[lang], so a request without a locale prefix is sent
 * to the visitor's best-matching language.
 *
 * Note: in Next 16 this file is `proxy.ts` (formerly `middleware.ts`) and is
 * NOT available under `output: "export"` — moving to a static host would mean
 * replacing this with a client-side redirect page.
 */
function preferredLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language");
  if (!header) return DEFAULT_LOCALE;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.split("=")[1]) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    const match = LOCALES.find((locale) => locale === base);
    if (match) return match;
  }
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocalePrefix = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocalePrefix) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals and anything that looks like a static file in /public.
  matcher: ["/((?!_next|.*\\.[^/]+$).*)"],
};
