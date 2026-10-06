"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Operator's cover, played rather than shown.
 *
 * The Figma frame is a tablet with two cards over it: an alert ("습도상승으로
 * 냉방효율저하 감지") whose 실행하기 is being pressed, and the confirmation that
 * follows ("적용 완료"). As a flat image the two read as a pair; here they run in
 * the order the product runs them — alert, press, confirmation — so the cover
 * says what Operator does before the case study does.
 *
 * Nobody has to touch it. It plays when the card opens, which on the pinned
 * accordion is the scroll arriving at it, and resets when the card closes, so
 * it plays again the next time the scroll comes back.
 *
 * Phases:
 *   0  tablet only
 *   1  the alert arrives
 *   2  the tap lands on 실행하기
 *   3  the press
 *   4  the confirmation drops in under it — the frame as drawn in Figma
 *
 * Geometry is the Figma frame's, in its own 671px units — see `.op-demo` in
 * globals.css.
 */

// When each phase starts after the card opens, in ms.
const TIMELINE = [400, 1200, 1800, 2100];
const FINAL_PHASE = TIMELINE.length;

export default function OperatorThumbnail({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0);

  // No reset branch: the accordion keys this component on whether the card is
  // open, so closing it unmounts the played state and opening it starts clean.
  useEffect(() => {
    if (!active) return;
    // Reduced motion gets the finished frame — the same picture, unplayed.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = reduced
      ? [setTimeout(() => setPhase(FINAL_PHASE), 0)]
      : TIMELINE.map((ms, i) => setTimeout(() => setPhase(i + 1), ms));
    return () => timers.forEach(clearTimeout);
  }, [active]);

  return (
    <div className="op-demo" data-phase={phase} aria-hidden>
      <div className="op-demo__stage">
        <div className="op-demo__tablet">
          <Image
            src="/thumbs/operator-tablet.webp"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 924px"
            className="object-cover"
          />
        </div>
        <div className="op-demo__bar" />

        {/* The alert. */}
        <div className="op-card op-card--alert">
          <div className="op-card__head">
            <span className="op-card__dot" />
            <span>습도상승으로 냉방효율저하 감지</span>
          </div>
          <div className="op-card__body">
            <span className="op-card__title">제습우선모드 + 목표온도 25도 조정</span>
            <span className="op-card__button op-card__button--run">실행하기</span>
            <span className="op-card__tap" />
          </div>
        </div>

        {/* The confirmation. */}
        <div className="op-card op-card--done">
          <div className="op-card__head">
            <span className="op-card__dot" />
            <span>오퍼레이터가 추천솔루션을 적용 완료했습니다!</span>
          </div>
          <div className="op-card__body">
            <span className="op-card__title">제습우선모드 + 목표온도 25도 조정</span>
            <span className="op-card__button op-card__button--done">
              {/* eslint-disable-next-line @next/next/no-img-element -- a 10px
                  stroke icon; the image pipeline has nothing to do for it. */}
              <img src="/thumbs/operator-check.svg" alt="" className="op-card__check" />
              적용 완료
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
