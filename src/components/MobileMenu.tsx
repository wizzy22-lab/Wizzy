"use client";

import { useEffect, useState } from "react";

/** Same shape the desktop bar builds — see `SiteHeader`. */
type NavLink = { label: string; href: string; file: boolean };

/**
 * The breakpoint the bar folds at. It is the same 1024px the project section
 * pins at, so the layout has one place it changes rather than two.
 */
const WIDE_QUERY = "(min-width: 1024px)";

/**
 * The nav below `lg`.
 *
 * The wordmark, four links and the language toggle need 531px in the widest
 * locale. A 390px phone does not have it, and laid out in one row they don't
 * merely crowd — they push the document wider than the viewport and take the
 * whole page off-axis, cropping the hero. So below `lg` the links fold behind a
 * button, and the bar keeps only the wordmark and the toggle for it.
 */
export default function MobileMenu({
  links,
  label,
  children,
}: {
  links: NavLink[];
  /** Accessible name for the button — localized by the caller. */
  label: string;
  /** The language toggle, server-rendered and handed down. */
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Widening past the breakpoint puts the full nav back in the bar. A panel
  // left open behind it would be a second copy of the same links, so the
  // crossing closes it — without waiting for a reload.
  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={label}
        // Wider than the glyph so the tap target clears 44px; the negative
        // margin keeps the glyph itself on the same right edge as the nav
        // above it.
        className="-mr-3 flex h-11 w-11 cursor-pointer items-center justify-center text-dim transition-opacity hover:opacity-70"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          {open ? (
            <>
              <path d="M4 4 L16 16" stroke="currentColor" strokeWidth="1.25" />
              <path d="M16 4 L4 16" stroke="currentColor" strokeWidth="1.25" />
            </>
          ) : (
            <>
              <path d="M2 5 H18" stroke="currentColor" strokeWidth="1.25" />
              <path d="M2 10 H18" stroke="currentColor" strokeWidth="1.25" />
              <path d="M2 15 H18" stroke="currentColor" strokeWidth="1.25" />
            </>
          )}
        </svg>
      </button>

      {/* Absolute against the header, which is `fixed` and so is the containing
          block. Opaque rather than the bar's translucent fill — a list of links
          has to stay readable over whatever section is behind it. */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="absolute inset-x-0 top-[70px] border-t border-border bg-bg px-6 pb-6 pt-2"
      >
        <nav className="flex flex-col">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...(link.file
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              // A hash link does not remount anything, so the panel has to take
              // itself down.
              onClick={() => setOpen(false)}
              className="py-3 text-body font-normal text-dim transition-opacity hover:opacity-70"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mt-2 border-t border-border pt-4">{children}</div>
      </div>
    </div>
  );
}
