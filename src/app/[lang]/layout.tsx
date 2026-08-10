import type { Metadata } from "next";
import { Manrope, Azeret_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { LOCALES, hasLocale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionaries";
import "../globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

// Label face — only the two weights the scale uses.
const azeretMono = Azeret_Mono({
  variable: "--font-azeret",
  subsets: ["latin"],
  weight: ["400", "500"],
});

/**
 * Canonical origin. `www` is where the apex redirects to, so this is the host a
 * shared link ends up on — and the one the preview image must be fetched from.
 */
const SITE_URL = "https://www.wizzydesign.space";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const dict = await getDictionary(lang);
  return {
    // Every URL below resolves against this, and a link preview needs absolute
    // ones — a relative `/og/…` is dropped by the crawlers.
    metadataBase: new URL(SITE_URL),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}`])),
    },
    // The card a shared link unfurls into: the hero itself, in the language of
    // the page being shared, rather than whatever image a crawler picks off the
    // page on its own.
    openGraph: {
      type: "website",
      siteName: dict.brand.name,
      locale: lang === "ko" ? "ko_KR" : "en_US",
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${lang}`,
      images: [
        {
          url: `/og/hero-${lang}.png`,
          width: 1200,
          height: 630,
          alt: dict.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [`/og/hero-${lang}.png`],
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    // Dark is the document default — case-study routes inherit it, and only the
    // main page's light sections opt out.
    <html
      lang={lang}
      data-theme="dark"
      className={`${manrope.variable} ${azeretMono.variable} h-full antialiased`}
    >
      <head>
        {/* Korean face. Not available through next/font, so it loads from the
            CDN — the variable dynamic subset (60KB of CSS vs 614KB for the
            static one) covers the 400/500 the scale needs. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
      </head>
      <body className="min-h-full">
        {children}

        {/* Contentsquare. `afterInteractive` hands the tag to next/script,
            which injects it once hydration has started — so it lands in the
            document rather than in the server-rendered <head>, and needs no
            `defer` of its own. Switch to `beforeInteractive` if the session
            has to be recorded from the very first paint. */}
        <Script
          src="https://t.contentsquare.net/uxa/c15c6a0ad1b24.js"
          strategy="afterInteractive"
        />

        <Analytics />
      </body>
    </html>
  );
}
