"use client";

import { useEffect, useState } from "react";

// Tuning knobs
const INTERVAL_MS = 2200; // how long each phrase stays
const SHIFT = "0.35em"; // vertical slide distance of inactive phrases

export default function RotatingHeadline({
  phrases,
  className = "",
}: {
  phrases: string[];
  /** Appended to the heading — the page uses it to tag the headline for the intro. */
  className?: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (phrases.length < 2) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % phrases.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [phrases.length]);

  return (
    <h1
      aria-live="polite"
      // Full-strength `--text`: the rotating word is the only thing in the hero
      // that is not dimmed, so the contrast step alone carries the emphasis the
      // brand colour used to.
      // `text-heading`, not `text-display`: the carousel below is now what
      // carries the first screen, and a display-scale headline over it left the
      // two competing. The box is 1.3em rather than 1.2 because this tier's
      // line-height is 1.25 — at 1.2 the descenders clip.
      className={`relative mt-2 flex h-[1.3em] w-full items-center justify-center text-heading font-medium text-text ${className}`}
    >
      {phrases.map((phrase, i) => {
        const isActive = i === active;
        return (
          <span
            key={phrase}
            aria-hidden={!isActive}
            style={{
              transform: isActive
                ? "translateY(0)"
                : `translateY(${i < active ? "-" + SHIFT : SHIFT})`,
            }}
            className={`absolute inset-x-0 whitespace-nowrap transition-all duration-500 ease-out motion-reduce:transform-none ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            {phrase}
          </span>
        );
      })}
    </h1>
  );
}
