"use client";

import { useEffect, useRef, useState } from "react";

type Theme = "dark" | "light";

/** Where we sample the page to decide what the bar is sitting on — the
 *  vertical middle of the 99px header, so the reading matches what the
 *  translucent background is actually blurring. */
const PROBE_Y = 50;

/**
 * The bar is `fixed`, so it crosses sections of both themes. Rather than pick
 * one treatment and lose contrast half the time, it adopts the theme of
 * whatever is underneath it — the wordmark, nav and toggle then invert for free,
 * because all three already read from the theme tokens.
 *
 * Only the `<header>` element lives in this client component. Its contents stay
 * server-rendered and arrive as `children`, so the dictionary never crosses the
 * boundary.
 */
export default function HeaderShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Sections are read on every pass: the accordion changes their heights as
    // it opens and closes, so a cached list of offsets would go stale.
    const main = ref.current?.parentElement;
    if (!main) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      let found: Theme | null = null;
      for (const el of main.querySelectorAll<HTMLElement>("[data-theme]")) {
        // The bar carries `data-theme` too and always covers the probe line —
        // reading it would just feed its own state back in.
        if (el === ref.current) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= PROBE_Y && bottom > PROBE_Y) {
          const t = el.dataset.theme;
          if (t === "dark" || t === "light") found = t;
        }
      }
      // Nothing under the probe (a gap, or a route with no themed sections)
      // leaves the last reading in place rather than flashing to a default.
      if (found) setTheme((prev) => (prev === found ? prev : found));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      ref={ref}
      data-theme={theme}
      // Section boundaries cut hard, but this element persists across them —
      // an instant flip strobes when a boundary sits under the bar, so the
      // colour change alone is eased.
      className="fixed inset-x-0 top-0 z-50 bg-bg/80 backdrop-blur-md transition-colors duration-200 motion-reduce:transition-none"
    >
      {children}
    </header>
  );
}
