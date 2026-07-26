import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries";
import LangToggle from "./LangToggle";

export default function SiteHeader({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  // Anchors resolve against the home page so the header works on case-study
  // routes too, where these sections don't exist.
  const links = [
    { label: dict.nav.project, href: `/${lang}#project` },
    { label: dict.nav.about, href: `/${lang}#about` },
    { label: dict.nav.resume, href: `/${lang}#resume` },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-[99px] w-full max-w-[1920px] items-center justify-between px-6 md:px-16 xl:px-[180px] 2xl:px-[360px]">
        <Link href={`/${lang}`} className="leading-tight">
          <p className="font-serif text-2xl tracking-[-0.05em] text-accent">
            {dict.brand.name}
          </p>
          <p className="text-center text-xs text-muted">{dict.brand.role}</p>
        </Link>

        <div className="flex items-center gap-8 md:gap-[52px]">
          <nav className="flex items-center gap-8 md:gap-[52px]">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm tracking-[0.02em] text-sky transition-opacity hover:opacity-70 md:text-base"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <LangToggle current={lang} />
        </div>
      </div>
    </header>
  );
}
