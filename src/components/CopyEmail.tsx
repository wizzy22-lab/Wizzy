"use client";

import { useEffect, useRef, useState } from "react";

const FEEDBACK_MS = 1600;

/**
 * The address copies itself on click instead of handing the visitor to a mail
 * client they may not use.
 *
 * It stays a real `mailto:` anchor underneath: if the Clipboard API is missing
 * — any non-secure origin — the click is simply not intercepted and the link
 * does what an email link normally does. That also keeps "copy link address"
 * and keyboard activation working, which a `<button>` would have lost.
 */
export default function CopyEmail({
  email,
  copiedLabel,
}: {
  email: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navigator.clipboard) return; // no API — let the mailto: through
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Denied mid-flight (an unfocused document, a blocked permission):
      // fall back to the behaviour the href already described.
      window.location.href = `mailto:${email}`;
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), FEEDBACK_MS);
  };

  return (
    <>
      <a
        href={`mailto:${email}`}
        onClick={onClick}
        // The address stays the accessible name even while the visible label
        // is showing the confirmation.
        aria-label={email}
        className="text-body text-dim transition-opacity hover:opacity-70"
      >
        <span aria-hidden>{copied ? copiedLabel : email}</span>
      </a>
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </>
  );
}
