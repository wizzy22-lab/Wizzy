"use client";

/* eslint-disable @next/next/no-img-element -- every image here is a patch cut
   from the cover at its own pixels, placed inside a stage that is scaled as
   one; the image pipeline's responsive sizing has nothing to do for them. */

import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";

/**
 * Bing X's cover, played rather than shown — lightly.
 *
 * The cover is a flat picture: a Master's detail screen on the left, the
 * onboarding's first screen on the right, the neon X behind them. Nothing in
 * it is a layer, so the motion is laid over it in three patches cut from the
 * picture itself:
 *
 *   - the X's neon, alone, breathing in and out the whole time the card is open
 *   - the Master's three headline stats, counting up from zero
 *   - the performance chart, drawn left to right — an empty plot (the same
 *     grid, no line or fill) wiped off the real one
 *
 * It is atmosphere, not a flow: the cover says "this is a Master you can read"
 * and leaves the decision story to the case study.
 *
 * Nobody has to touch it. It plays when the card opens and keeps playing while
 * the card stays open; the accordion remounts it on close.
 *
 * Phases:
 *   0  stats at zero, chart empty
 *   1  the stats count up and the chart draws
 *   2  the finished frame — the cover as drawn
 *   3  stats and chart fade back out, and the loop goes back to 0
 *
 * Geometry is the cover's, in its own 671px units — half the 1342px picture
 * the patches were cut from. See `.bx-demo` in globals.css.
 */

// The app's face. Loaded here alone: nothing else on the site sets it.
const inter = Inter({ subsets: ["latin"], weight: ["500"], display: "swap" });

// One pass, in ms from its start. The first starts when the card opens.
const PASS = [
  { phase: 1, at: 300 }, // count and draw
  { phase: 2, at: 1900 }, // done
  { phase: 3, at: 5200 }, // fade out
];
const PASS_END = 5600; // back to 0, and again
const FINAL_PHASE = 2;
const COUNT_MS = 1400;

const SRC = "/thumbs/bingx";

// The three numbers in the stats panel, centred under their labels. `cover`
// is the span each one's original ink is painted out across.
const STATS = [
  { value: 187.82, format: (n: number) => `+${n.toFixed(2)}%`, x: 98, cover: [76, 120] },
  {
    value: 6479,
    format: (n: number) => Math.round(n).toLocaleString("en-US"),
    x: 164,
    cover: [150, 178],
  },
  {
    value: 1450988.23,
    format: (n: number) =>
      n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    x: 230,
    cover: [199.5, 260.5],
  },
];

export default function BingxThumbnail({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const statRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // The stage is laid out at 671px and scaled to the cover's real width.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(([entry]) => {
      root.style.setProperty("--k", String(entry.contentRect.width / 671));
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    // Reduced motion gets the finished frame — the same picture, unplayed.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    if (reduced) {
      at(0, () => setPhase(FINAL_PHASE));
    } else {
      const pass = () => {
        PASS.forEach(({ phase, at: ms }) => at(ms, () => setPhase(phase)));
        at(PASS_END, () => {
          setPhase(0);
          pass();
        });
      };
      pass();
    }
    return () => timers.forEach(clearTimeout);
  }, [active]);

  // The count runs outside React: three text nodes rewritten each frame.
  useEffect(() => {
    const write = (t: number) =>
      STATS.forEach((s, i) => {
        const el = statRefs.current[i];
        if (el) el.textContent = s.format(s.value * t);
      });

    if (phase === 0) write(0);
    if (phase === 2) write(1);
    if (phase !== 1) return;

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      write(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  return (
    <div ref={rootRef} className="bx-demo" data-phase={phase} aria-hidden>
      <div className="bx-demo__stage">
        <img src="/thumbs/bingx-card.webp" alt="" className="absolute inset-0 size-full" />

        {/* The X's neon, cut out on its own. */}
        <img
          src={`${SRC}/neon.webp`}
          alt=""
          className="bx-neon absolute left-[298px] top-0 h-[280.5px] w-[373px] max-w-none"
        />

        {/* The three numbers, painted out with the panel's own flat colour —
            no image to wait for, so the old figures never show through — and
            set back over it live. */}
        {STATS.map((s) => (
          <span
            key={s.x}
            className="bx-stat-cover"
            style={{ left: s.cover[0], width: s.cover[1] - s.cover[0] }}
          />
        ))}
        {STATS.map((s, i) => (
          <span
            key={i}
            ref={(el) => {
              statRefs.current[i] = el;
            }}
            className={`bx-stat ${inter.className}`}
            style={{ left: s.x }}
          >
            {s.format(0)}
          </span>
        ))}

        {/* The plot without its line, wiped off the real one. */}
        <img
          src={`${SRC}/chart-empty.webp`}
          alt=""
          className="bx-chart-cover absolute left-[81.5px] top-[290px] h-[54px] w-[187px] max-w-none"
        />
      </div>
    </div>
  );
}
