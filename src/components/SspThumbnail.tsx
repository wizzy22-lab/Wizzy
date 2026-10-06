"use client";

/* eslint-disable @next/next/no-img-element -- every image here is a small
   Figma export placed at fixed Figma pixels inside a stage that is scaled as
   one; the image pipeline's responsive sizing has nothing to do for them. */

import { useEffect, useRef, useState } from "react";

/**
 * Shoot Shoot Penguin's cover, played rather than shown.
 *
 * Two phones from the app — a player's map on the left, the team lead's home
 * on the right — and the one thing that connects them. The player applies to
 * SH 스포츠센터, which is 팀 슛슛펭귄's game, and the application lands on the
 * lead's screen. That is the case in one beat: one product, two sides, one
 * flow, read left to right in the order it happens.
 *
 * Nobody has to touch it. It plays when the card opens, which on the pinned
 * accordion is the scroll arriving at it, and keeps playing while the card
 * stays open — once is easy to miss. The accordion remounts it on close.
 *
 * Phases:
 *   0  phones only
 *   1  the map pins drop in, one after another
 *   2  the tap lands on SH 스포츠센터's 신청
 *   3  the press
 *   4  applied — the button becomes 신청완료 and the game's pin, which counts
 *      the places still open, drops by one
 *   5  the lead's screen catches up: a third guest, a seventh to approve
 *   6  the changed parts fade out, and the loop goes back to 1 — the pins stay
 *      down; only the apply-and-arrive part replays
 *
 * Geometry is Figma's: the 671px cover frame, and the two 390×844 app frames
 * scaled to 240 wide inside it. Colours are the app's tokens — see `.ssp-demo`
 * in globals.css.
 */

// One pass, in ms from phase 1. The pins drop 300ms after the card opens.
const DROP_AT = 300;
const PASS = [
  { phase: 2, at: 1200 }, // tap
  { phase: 3, at: 1800 }, // press
  { phase: 4, at: 2050 }, // applied
  { phase: 5, at: 2700 }, // arrived
  { phase: 6, at: 5700 }, // fade the changes out
];
const PASS_END = 6050; // back to phase 1, and again
const FINAL_PHASE = 5;

const SRC = "/thumbs/ssp";

export default function SspThumbnail({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // The stage is laid out at 671px and scaled to the cover's real width. The
  // factor goes straight onto a custom property — it is layout, not state.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(([entry]) => {
      root.style.setProperty("--k", String(entry.contentRect.width / 671));
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  // No reset branch: the accordion keys this component on whether the card is
  // open, so closing it unmounts the played state and opening it starts clean.
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
          setPhase(1);
          pass();
        });
      };
      at(DROP_AT, () => {
        setPhase(1);
        pass();
      });
    }
    return () => timers.forEach(clearTimeout);
  }, [active]);

  const applied = phase >= 4;
  const arrived = phase >= 5;

  return (
    <div ref={rootRef} className="ssp-demo" data-phase={phase} aria-hidden>
      <div className="ssp-demo__stage">
        {/* The map the player's screen is cut from, running off the right. */}
        <img
          src={`${SRC}/strip.webp`}
          alt=""
          className="absolute left-[336px] top-0 h-[698px] w-[345px] max-w-none"
        />
        <BigPin no="1" className="left-[613px] top-[39px] h-[44px] w-[36px]" delay={0} />
        <BigPin
          no="3"
          small
          className="left-[637px] top-[629px] h-[29px] w-[24px]"
          delay={360}
        />

        {/* Player first, lead second: the order the application travels in.
            Figma has them the other way round; the slots are kept. */}
        <Phone className="left-[90px] top-[102px]">
          <PlayerScreen applied={applied} />
        </Phone>
        <Phone className="left-[342px] top-[54px]">
          <LeadScreen arrived={arrived} />
        </Phone>
      </div>
    </div>
  );
}

/** A 390×844 app frame, scaled to the 240 it is drawn at on the cover. */
function Phone({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <div
      className={`absolute h-[519px] w-[240px] overflow-hidden rounded-[13px] bg-white ${className}`}
    >
      <div className="absolute left-0 top-0 h-[844px] w-[390px] origin-top-left scale-[0.61538]">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pieces both screens share                                           */
/* ------------------------------------------------------------------ */

function StatusBar() {
  return (
    <div className="absolute left-0 top-0 h-[48px] w-[390px]">
      <img
        src={`${SRC}/status-right.svg`}
        alt=""
        className="absolute right-[17.67px] top-[16.33px] h-[11.337px] w-[66.66px]"
      />
      <p className="ssp-clock absolute left-[18px] top-[12px] w-[54px] text-center text-[15px] leading-[20px] tracking-[-0.5px] text-[var(--ssp-ink)]">
        9:41
      </p>
    </div>
  );
}

const NAV = [
  { icon: "nav-home", label: "홈", on: true },
  { icon: "nav-groups", label: "나의팀" },
  { icon: "nav-calendar", label: "경기 캘린더" },
  { icon: "nav-notifications", label: "알림" },
  { icon: "nav-more", label: "더보기" },
];

function BottomNav() {
  return (
    <>
      <div className="absolute bottom-[32px] left-0 flex w-[390px] items-center border-t border-[var(--ssp-border-subtle)] bg-white">
        {NAV.map((item) => (
          <div key={item.label} className="relative h-[64px] w-[78px]">
            <div className="absolute left-1/2 top-[8px] flex w-[24px] -translate-x-1/2 flex-col items-center gap-[8px]">
              <img src={`${SRC}/${item.icon}.svg`} alt="" className="size-[24px]" />
              <p
                className={`whitespace-nowrap text-[11px] font-bold leading-[14px] tracking-[0.22px] ${
                  item.on ? "text-[var(--ssp-content-primary)]" : "text-[var(--ssp-content-tertiary)]"
                }`}
              >
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 h-[32px] w-[390px] bg-white">
        <div className="absolute left-1/2 top-1/2 h-[4px] w-[134px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--ssp-ink)]" />
      </div>
    </>
  );
}

/** MapPin/28 from the app — a count of the places still open at that game. */
function MapPin({
  no,
  className,
  delay,
  hop = false,
}: {
  no: string;
  className: string;
  delay: number;
  hop?: boolean;
}) {
  return (
    <div
      className={`ssp-pin absolute h-[34px] w-[28px] ${hop ? "ssp-pin--hop" : ""} ${className}`}
      style={{ "--drop-delay": `${delay}ms` } as React.CSSProperties}
    >
      <div className="absolute left-1/2 top-0 h-[33.799px] w-[28px] -translate-x-1/2">
        <div className="absolute inset-[-17.75%_-50%_-65.09%_-50%]">
          <img src={`${SRC}/pin-28.svg`} alt="" className="block size-full max-w-none" />
        </div>
      </div>
      <p className="absolute left-[calc(50%-4px)] top-[7px] whitespace-nowrap text-[11px] font-bold leading-[14px] tracking-[0.22px] text-white">
        {no}
      </p>
    </div>
  );
}

/** MapPin/36, the larger pins on the map outside the phones. */
function BigPin({
  no,
  className,
  delay,
  small = false,
}: {
  no: string;
  className: string;
  delay: number;
  small?: boolean;
}) {
  return (
    <div
      className={`ssp-pin absolute ${className}`}
      style={{ "--drop-delay": `${delay}ms` } as React.CSSProperties}
    >
      <div
        className={`absolute left-1/2 top-0 -translate-x-1/2 ${
          small ? "h-[34.567px] w-[28.636px]" : "h-[43.456px] w-[36px]"
        }`}
      >
        <div className="absolute inset-[-13.81%_-38.89%_-50.63%_-38.89%]">
          <img
            src={`${SRC}/${small ? "pin-36-small" : "pin-36"}.svg`}
            alt=""
            className="block size-full max-w-none"
          />
        </div>
      </div>
      <p
        className={`absolute whitespace-nowrap font-semibold text-white ${
          small
            ? "left-[calc(50%-3.18px)] top-[calc(50%-9.55px)] text-[11.14px] leading-[14.318px]"
            : "left-[calc(50%-4px)] top-[calc(50%-12px)] text-[14px] leading-[18px]"
        }`}
      >
        {no}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The player                                                          */
/* ------------------------------------------------------------------ */

type Game = {
  date: string;
  status: "recruiting" | "closing" | "full";
  name: string;
  team: string;
  tags: string[];
};

const GAMES: Game[] = [
  { date: "9.12 (목)", status: "recruiting", name: "SH 스포츠센터", team: "팀 슛슛펭귄", tags: ["주차가능", "샤워실", "실내"] },
  { date: "9.13 (금)", status: "closing", name: "잠실 실내 체육관", team: "팀 엠제이", tags: ["주차가능", "샤워실", "실내"] },
  { date: "9.14(토)", status: "full", name: "올림픽공원 체육관", team: "팀 하이브이", tags: ["주차가능", "야외"] },
];

const STATUS = {
  recruiting: { label: "모집중", icon: "icon-recruiting", tint: "bg-[var(--ssp-recruiting-tint)]", text: "text-[var(--ssp-recruiting-text)]" },
  closing: { label: "마감임박", icon: "icon-history", tint: "bg-[var(--ssp-closing-tint)]", text: "text-[var(--ssp-closing-text)]" },
  full: { label: "마감", icon: "icon-lock", tint: "bg-[var(--ssp-tint)]", text: "text-[var(--ssp-full-text)]" },
} as const;

function PlayerScreen({ applied }: { applied: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      {/* Map */}
      <div className="absolute left-[-19px] top-0 h-[844px] w-[429px] overflow-hidden">
        <img
          src={`${SRC}/map.webp`}
          alt=""
          className="absolute left-0 top-[-19.87%] h-[129.04%] w-[117.37%] max-w-none"
        />
      </div>

      <StatusBar />

      {/* Search */}
      <div className="ssp-shadow-floating absolute left-[16px] top-[48px] w-[358px] rounded-[12px] bg-white px-[18px]">
        <div className="flex h-[48px] items-center gap-[8px]">
          <img src={`${SRC}/icon-search.svg`} alt="" className="size-[20px]" />
          <p className="text-[16px] leading-[24px] text-[var(--ssp-content-tertiary)]">
            역이나 체육관을 검색하세요
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="absolute left-[16px] top-[108px] flex items-center gap-[6px]">
        {["4월 3일", "시간"].map((label) => (
          <span
            key={label}
            className="ssp-shadow-raised flex h-[36px] items-center rounded-full bg-white px-[16px] text-[14px] font-semibold leading-[18px] text-[var(--ssp-content-secondary)]"
          >
            {label}
          </span>
        ))}
        <span className="ssp-shadow-raised flex h-[36px] items-center rounded-full bg-[var(--ssp-action)] px-[16px] text-[14px] font-semibold leading-[18px] text-white">
          마감 가리기
        </span>
        <span className="ssp-shadow-icon flex size-[36px] items-center justify-center rounded-full bg-white">
          <img src={`${SRC}/icon-filter.svg`} alt="" className="size-[20px]" />
        </span>
      </div>

      {/* Games */}
      <div className="ssp-shadow-sheet absolute bottom-[97px] left-0 w-[390px] overflow-hidden rounded-t-[20px] bg-white">
        <div className="relative h-[32px]">
          <div className="absolute left-1/2 top-1/2 h-[4px] w-[48px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--ssp-grabber)]" />
        </div>
        {GAMES.map((game, i) => {
          const status = STATUS[game.status];
          const isApplyTarget = i === 0;
          const disabled = game.status === "full" || (isApplyTarget && applied);
          const label = game.status === "full" ? "마감" : isApplyTarget && applied ? "신청완료" : "신청";
          return (
            <div
              key={game.name}
              className="flex items-center justify-between border-t border-[var(--ssp-border-subtle)] p-[16px]"
            >
              <div className="flex items-center gap-[12px]">
                <div className="flex w-[59px] flex-col items-center gap-[2px]">
                  <p className="w-full text-[20px] font-extrabold leading-[24px] tracking-[-0.4px] text-[var(--ssp-content-primary)]">
                    09:00
                  </p>
                  <p className="whitespace-nowrap text-[12px] leading-[24px] text-[var(--ssp-content-secondary)]">
                    {game.date}
                  </p>
                  <span className={`flex h-[20px] w-full items-center justify-center gap-[4px] rounded-[6px] px-[6px] ${status.tint}`}>
                    <img src={`${SRC}/${status.icon}.svg`} alt="" className="size-[12px]" />
                    <span className={`whitespace-nowrap text-[11px] font-bold leading-[14px] tracking-[0.22px] ${status.text}`}>
                      {status.label}
                    </span>
                  </span>
                </div>
                <div className="flex w-[139px] flex-col items-start gap-[2px]">
                  <p className="whitespace-nowrap text-[20px] font-extrabold leading-[24px] tracking-[-0.4px] text-[var(--ssp-content-primary)]">
                    {game.name}
                  </p>
                  <p className="text-[12px] leading-[24px] text-[var(--ssp-content-secondary)]">
                    {game.team}
                  </p>
                  <div className="flex items-center gap-[4px]">
                    {game.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex h-[20px] items-center rounded-full border border-[var(--ssp-border-strong)] bg-[var(--ssp-tint)] px-[6px] text-[11px] font-bold leading-[14px] tracking-[0.22px] text-[var(--ssp-full-text)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <span
                className={`flex h-[44px] shrink-0 items-center justify-center rounded-[12px] px-[16px] text-[14px] font-semibold leading-[18px] ${
                  isApplyTarget ? "ssp-apply" : ""
                } ${
                  disabled
                    ? "bg-[var(--ssp-disabled)] text-[var(--ssp-content-tertiary)]"
                    : "bg-[var(--ssp-action)] text-white"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <BottomNav />

      {/* Map controls */}
      <span className="ssp-shadow-icon absolute left-[16px] top-[361px] flex size-[36px] items-center justify-center rounded-full bg-white">
        <img src={`${SRC}/icon-my-location.svg`} alt="" className="size-[20px]" />
      </span>
      <img src={`${SRC}/location-range.svg`} alt="" className="absolute left-[28px] top-[193px] size-[120px]" />

      <MapPin no="1" className="left-[343px] top-[165px]" delay={120} />
      {/* SH 스포츠센터: three places open until the player takes one. */}
      <MapPin
        key={applied ? "after" : "before"}
        no={applied ? "2" : "3"}
        hop={applied}
        className="ssp-pin--count left-[227px] top-[335px]"
        delay={240}
      />

      {/* The tap, over 신청. */}
      <span className="ssp-tap left-[337px] top-[477px]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The team lead                                                       */
/* ------------------------------------------------------------------ */

const TEAM_TOOLS = [
  { icon: "tm-invite", label: "팀 초대" },
  { icon: "tm-vote", label: "투표" },
  { icon: "tm-guest", label: "게스트 모집" },
  { icon: "tm-members", label: "팀원 관리" },
  { icon: "tm-info", label: "팀 정보" },
  { icon: "tm-games", label: "경기 관리" },
];

function LeadScreen({ arrived }: { arrived: boolean }) {
  const notices = [
    { text: "04.12 경기 투표를 아직 안했어요" },
    { text: arrived ? "게스트 3명이 신청했어요" : "게스트 2명이 신청했어요", fresh: true },
    { text: "팀 정보가 업데이트 되었어요" },
  ];
  const week = [
    { n: "3", label: "예정 경기" },
    { n: arrived ? "7" : "6", label: "승인 대기", fresh: true },
    { n: "7", label: "남은 자리" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      <StatusBar />

      {/* Team */}
      <div className="absolute left-[16px] top-[48px] flex w-[358px] items-center justify-between">
        <div className="flex items-center gap-[4px]">
          <span className="relative size-[36px] overflow-hidden rounded-full border border-[var(--ssp-border-subtle)] bg-white">
            <img src={`${SRC}/profile.png`} alt="" className="absolute inset-0 size-full object-cover opacity-20" />
          </span>
          <p className="whitespace-nowrap text-[24px] font-extrabold leading-[32px] tracking-[-0.48px] text-[var(--ssp-content-primary)]">
            슛슛펭귄
          </p>
          <img src={`${SRC}/arrow-down.svg`} alt="" className="size-[24px]" />
        </div>
        <img src={`${SRC}/icon-more.svg`} alt="" className="size-[20px]" />
      </div>

      {/* Now */}
      <div className="absolute left-[16px] top-[108px] flex w-[358px] flex-col items-start gap-[8px]">
        <div className="flex items-center gap-[8px]">
          <p className="whitespace-nowrap text-[20px] font-extrabold leading-[24px] tracking-[-0.4px] text-[var(--ssp-content-primary)]">
            지금 확인할 것
          </p>
          <span className="flex size-[24px] items-center justify-center rounded-full bg-[var(--ssp-content-primary)] text-[18px] font-bold leading-[24px] text-white">
            3
          </span>
        </div>
        <div className="flex w-full flex-col gap-[10px] overflow-hidden rounded-[12px] bg-[var(--ssp-tint)]">
          {notices.map((notice) => (
            <div
              key={notice.fresh ? "guest" : notice.text}
              className={`flex w-full items-center justify-between px-[12px] py-[8px] ${
                notice.fresh && arrived ? "ssp-arrive" : ""
              }`}
            >
              <p
                className={`whitespace-nowrap text-[14px] leading-[24px] text-[var(--ssp-content-primary)] ${
                  notice.fresh ? "ssp-swap" : ""
                }`}
              >
                {notice.text}
              </p>
              <img src={`${SRC}/chevron.svg`} alt="" className="size-[20px]" />
            </div>
          ))}
        </div>
      </div>

      {/* This week */}
      <div className="absolute left-[16px] top-[304px] flex w-[358px] flex-col items-start gap-[8px]">
        <p className="w-full text-[20px] font-extrabold leading-[24px] tracking-[-0.4px] text-[var(--ssp-content-primary)]">
          이번 주
        </p>
        <div className="flex w-full items-center gap-[8px]">
          {week.map((card) => (
            <div
              key={card.label}
              className={`flex w-[114px] items-center justify-center rounded-[12px] bg-[var(--ssp-tint)] px-[30px] py-[8px] ${
                card.fresh && arrived ? "ssp-arrive" : ""
              }`}
            >
              <div className="flex w-[45px] flex-col items-center leading-[24px]">
                <p
                  className={`w-full text-center text-[20px] font-extrabold tracking-[-0.4px] text-[var(--ssp-content-primary)] ${
                    card.fresh ? "ssp-swap" : ""
                  }`}
                >
                  {card.n}
                </p>
                <p className="whitespace-nowrap text-[12px] text-[var(--ssp-content-secondary)]">
                  {card.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team tools */}
      <div className="absolute left-[16px] top-[424px] flex w-[358px] flex-col items-start gap-[8px]">
        <p className="w-full text-[20px] font-extrabold leading-[24px] tracking-[-0.4px] text-[var(--ssp-content-primary)]">
          팀 관리
        </p>
        <div className="grid w-full grid-cols-2 gap-[8px]">
          {TEAM_TOOLS.map((tool) => (
            <div
              key={tool.label}
              className="flex items-center justify-center rounded-[12px] bg-[var(--ssp-tint)] px-[30px] py-[16px]"
            >
              <div className="flex h-[48px] flex-col items-center gap-[4px]">
                <img src={`${SRC}/${tool.icon}.svg`} alt="" className="size-[24px]" />
                <p className="whitespace-nowrap text-[16px] font-bold leading-[24px] text-[var(--ssp-content-primary)]">
                  {tool.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
