"use client";

import { useEffect, useState } from "react";

// Tuning knobs
const INTERVAL_MS = 2200; // how long each phrase stays
const SHIFT = "0.35em"; // vertical slide distance of inactive phrases

export default function RotatingHeadline({ phrases }: { phrases: string[] }) {
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
      className="relative mt-2 flex h-[1.2em] w-full items-center justify-center text-display font-medium text-accent"
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
