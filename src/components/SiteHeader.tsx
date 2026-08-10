import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries";
import { RESUME_PDF } from "@/content/links";
import HeaderShell from "./HeaderShell";
import LangToggle from "./LangToggle";
import MobileMenu from "./MobileMenu";

export default function SiteHeader({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  // Anchors resolve against the home page so the header works on case-study
  // routes too, where these sections don't exist.
  // ABOUT now resolves to the timeline — the standalone intro section is gone,
  // and "How I got here" is what the about anchor describes.
  // CONTACT resolves to the footer, which carries `id="contact"` — there is no
  // separate contact section, and a dead anchor would scroll nowhere.
  const links = [
    { label: dict.nav.project, href: `/${lang}#project`, file: false },
    { label: dict.nav.about, href: `/${lang}#about`, file: false },
    // Not a section — opens the CV itself. Served straight from `public/`.
    { label: dict.nav.resume, href: RESUME_PDF[lang], file: true },
    { label: dict.nav.contact, href: `/${lang}#contact`, file: false },
  ];

  return (
    // `HeaderShell` owns the <header> element and tracks which section is
    // underneath; everything below stays server-rendered.
    <HeaderShell>
      <div className="mx-auto flex h-[70px] w-full max-w-[1920px] items-center justify-between px-6 md:px-16 xl:px-[180px] 2xl:px-[360px]">
        {/* The role line moved out — the hero label already says it. */}
        <Link
          href={`/${lang}`}
          className="wordmark transition-opacity hover:opacity-70"
        >
          {dict.brand.name}
        </Link>

        {/* From `lg` up the links sit in the bar. Below it they don't fit —
            see `MobileMenu`, which carries the same links and toggle. */}
        <div className="hidden items-center gap-8 md:gap-[52px] lg:flex">
          <nav className="flex items-center gap-8 md:gap-[52px]">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                // The CV opens in its own tab so it never replaces the site.
                {...(link.file
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                // Body face at 1rem, lowercase as written in the dictionary —
                // not the tracked-out mono label the rest of the page uses.
                className="text-body font-normal text-dim transition-opacity hover:opacity-70"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <LangToggle current={lang} />
        </div>

        <MobileMenu links={links} label={dict.nav.menu}>
          <LangToggle current={lang} />
        </MobileMenu>
      </div>
    </HeaderShell>
  );
}
