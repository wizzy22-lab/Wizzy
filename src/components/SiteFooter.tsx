import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/dictionaries";
import { EMAIL, RESUME_PDF, SOCIAL_LINKS } from "@/content/links";
import CopyEmail from "./CopyEmail";

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="text-heading font-normal text-text">{children}</h2>;
}

export default function SiteFooter({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const { footer } = dict;
  // Rendered only when there is something to list — an empty `SOCIAL_LINKS`
  // drops the column rather than leaving a heading with nothing under it.
  const hasSocial = SOCIAL_LINKS.length > 0;

  return (
    // Closes the page on the light set. `#contact` is the header's target —
    // there is no separate contact section, so the nav lands here.
    <footer
      id="contact"
      data-theme="light"
      className="w-full scroll-mt-[70px] bg-bg pb-16 pt-32 font-sans"
    >
      <div className="mx-auto w-full max-w-[1920px] px-6 md:px-16 xl:px-[180px] 2xl:px-[360px]">
        {/*
          One row: link columns on the left, the mark on the right. `items-start`
          is what lines the mark's cap up with the column labels — both boxes
          begin at the same y, and the mark's line-height of 1 keeps its text
          tight to the top of its box.
        */}
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          {/* 2×2 on small screens, a single row of columns from lg up. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-14 lg:flex lg:gap-x-20">
            {hasSocial && (
              <div>
                <ColumnLabel>{footer.connect}</ColumnLabel>
                <ul className="mt-6 flex flex-col gap-3">
                  {SOCIAL_LINKS.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-body text-dim transition-opacity hover:opacity-70"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <ColumnLabel>{footer.getInTouch}</ColumnLabel>
              <ul className="mt-6 flex flex-col gap-3">
                <li>
                  <CopyEmail email={EMAIL} copiedLabel={footer.copied} />
                </li>
                <li>
                  <a
                    href={RESUME_PDF[lang]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body text-dim transition-opacity hover:opacity-70"
                  >
                    {footer.resume}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <ColumnLabel>{footer.location}</ColumnLabel>
              <p className="mt-6 text-body text-dim">{footer.locationValue}</p>
            </div>

          </div>

          {/* The mark, and the notice sitting under it. Left-aligned on mobile,
              where it has dropped below the columns rather than beside them. */}
          <div className="shrink-0 lg:text-right">
            <p aria-hidden className="wordmark-display">
              {dict.brand.name}
            </p>
            {/* Label scale, but `normal-case`: the notice names the mark, and
                uppercasing it to WIZZY would contradict the lowercase wordmark
                directly above. */}
            <p className="type-label mt-5 normal-case text-dim">
              {footer.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
