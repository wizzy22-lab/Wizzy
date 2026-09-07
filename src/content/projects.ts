import type { Localized } from "@/lib/i18n";

/**
 * Which main-page section a card renders in. `project` is the scroll-driven
 * accordion; `business` is the smaller two-column grid below it.
 */
export type ProjectGroup = "project" | "business";

export type Project = {
  /** URL segment: /[lang]/projects/[slug] */
  slug: string;
  group: ProjectGroup;
  /** Display number in the main-page accordion. */
  no: string;
  name: string;
  subtitle: Localized;
  /**
   * One line of outcome — the result the project actually produced, in numbers
   * where there are numbers. Sits between the subtitle and the description at
   * full-strength `--text`, so the claim reads before the paragraph does.
   */
  outcome: Localized;
  tags: Localized[];
  description: Localized;
  /**
   * Square (1:1) thumbnail shown in the accordion, cropped to fill. `null`
   * leaves the slot empty rather than drawing a stand-in.
   */
  thumbnail: string | null;
  /** Whether a full case study exists in `src/content/case-studies`. */
  hasCaseStudy: boolean;
  /**
   * Case study hosted outside this site. When set, the card links straight out
   * instead of to `/[lang]/projects/[slug]` — same tab either way, since it is
   * still a case study rather than an outside service.
   */
  externalUrl?: string;
};

/**
 * Copy carried over from the legacy site's project cards, with the newer
 * naming used in the current Figma direction ("Shoot Shoot Penguin" was
 * previously shipped as "GEME").
 *
 * Array order is the display order — `no` only labels the card, so both move
 * together when a project is reordered.
 */
export const PROJECTS: Project[] = [
  {
    slug: "bingx",
    group: "project",
    no: "01",
    name: "BingX",
    subtitle: {
      en: "AI Master Decision Flow Redesign",
      ko: "AI Master 의사결정 플로우 리디자인",
    },
    // `n=5` reads as a sample size to anyone who runs studies and as nothing
    // at all to everyone else, and this line is the first thing a recruiter
    // sees. Spelled out on the card; the case page keeps the notation.
    outcome: {
      en: "Usability score 88 (SUS, 5 participants) — AI trading redesigned around a 7-Master selection flow",
      ko: "사용성 테스트 88점(SUS · 참가자 5명) — 7인 Master 선택 구조로 재설계한 AI 트레이딩 의사결정 플로우",
    },
    tags: [
      { en: "UX Research", ko: "UX 리서치" },
      { en: "Design System", ko: "디자인 시스템" },
      { en: "AI UX", ko: "AI UX" },
    ],
    description: {
      en: "Redesigned an AI trading service around its decision flow — matching users to the right Master through onboarding, and making automated trading understandable before money goes in.",
      ko: "AI 트레이딩 서비스를 의사결정 흐름 중심으로 리디자인했다. 온보딩으로 사용자를 적합한 Master와 연결하고, 돈을 넣기 전에 자동매매를 이해할 수 있게 만들었다.",
    },
    thumbnail: "/thumbs/bingx-thumb.webp",
    hasCaseStudy: false,
    externalUrl: "https://bingx-portfolio.vercel.app/",
  },
  {
    slug: "operator",
    group: "project",
    no: "02",
    name: "Operator",
    subtitle: {
      en: "HVAC Cost Optimization Decision Support System for Small Businesses",
      ko: "자영업자를 위한 냉난방 비용 최적화 의사결정 지원 시스템",
    },
    outcome: {
      en: "Usability score 76 (SUS, 5 participants) — required inputs cut from 7 to 3",
      ko: "사용성 테스트 76점(SUS · 참가자 5명) — 필수 입력 7개 → 3개",
    },
    tags: [
      { en: "Product Design", ko: "프로덕트 디자인" },
      { en: "UX Research", ko: "UX 리서치" },
      { en: "Concept Project", ko: "컨셉 프로젝트" },
    ],
    description: {
      en: "Designed an operational UX system that helps small business owners reduce HVAC costs by making clear, data-driven decisions within complex pricing structures and environments.",
      ko: "복잡한 요금 구조와 환경 속에서 자영업자가 데이터 기반의 명확한 판단을 내려 냉난방 비용을 줄일 수 있도록 돕는 운영 UX 시스템을 디자인했다.",
    },
    thumbnail: "/thumbs/operator-thumb.webp",
    hasCaseStudy: true,
    externalUrl: "https://wizzy-s-portfolio.vercel.app/projects/operator.html",
  },
  {
    slug: "shoot-shoot-penguin",
    group: "project",
    no: "03",
    name: "Shoot Shoot Penguin",
    subtitle: {
      en: "AI-Assisted Basketball Team Management Platform",
      ko: "AI 기반 농구 팀 운영 플랫폼",
    },
    outcome: {
      en: "Two-sided platform that automates guest recruiting — designed end-to-end with a developer, from IA to handoff",
      ko: "개발자와 2인, IA부터 핸드오프까지 — 게스트 모집을 자동화하는 양면 플랫폼",
    },
    tags: [
      { en: "End to End Design", ko: "엔드투엔드 디자인" },
      { en: "Mobile UX", ko: "모바일 UX" },
      { en: "In Development", ko: "개발 중" },
    ],
    description: {
      en: "Co-founded and designed a mobile platform that transforms complex team management and guest matching into clear, actionable experiences — from problem definition to developer handoff.",
      ko: "복잡한 팀 운영과 게스트 매칭을 명확하고 실행 가능한 경험으로 바꾸는 모바일 플랫폼을 공동 창업하고 디자인했다. 문제 정의부터 개발 핸드오프까지 전 과정을 담당했다.",
    },
    thumbnail: "/thumbs/ssp-thumb.webp",
    hasCaseStudy: false,
    externalUrl: "https://shoot-shoot-penguin.vercel.app/",
  },
  {
    slug: "weekend-greenwich",
    group: "business",
    no: "04",
    name: "Weekend Greenwich",
    subtitle: {
      en: "Food & Lifestyle Brand",
      ko: "푸드 & 라이프스타일 브랜드",
    },
    outcome: {
      en: "Data-driven renewal that grew dessert revenue 200–300% as freelance brand director",
      ko: "프리랜서 브랜드 디렉터로 디저트 매출 200~300% 성장을 만든 데이터 리뉴얼",
    },
    tags: [
      { en: "Brand Design", ko: "브랜드 디자인" },
      { en: "Product Development", ko: "제품 개발" },
      { en: "Offline Experience", ko: "오프라인 경험" },
    ],
    description: {
      en: "Led product design and development based on brand identity, creating an offline brand experience that connects directly with real customers.",
      ko: "브랜드 아이덴티티를 기반으로 제품 디자인과 개발을 이끌며, 실제 고객과 직접 연결되는 오프라인 브랜드 경험을 만들었다.",
    },
    thumbnail: "/thumbs/wg-thumb.webp",
    // Renders through `BusinessCasePage` — see `content/business-cases`.
    hasCaseStudy: true,
  },
  {
    slug: "wizzy-bakeshop",
    group: "business",
    no: "05",
    name: "Wizzy Bakeshop",
    subtitle: {
      en: "Experience-driven Dessert Brand",
      ko: "경험 중심 디저트 브랜드",
    },
    outcome: {
      en: "58% repeat-visit rate (POS) — a dessert brand founded and run for 2 years",
      ko: "재방문율 58%(POS) — 2년 2개월 창업·운영한 디저트 브랜드",
    },
    tags: [
      { en: "Brand Design", ko: "브랜드 디자인" },
      { en: "Service Design", ko: "서비스 디자인" },
      { en: "Operations", ko: "운영" },
    ],
    description: {
      en: "Built and operated a dessert brand, designing the full customer experience from product to service in a real business environment.",
      ko: "디저트 브랜드를 직접 만들고 운영하며, 실제 비즈니스 환경에서 제품부터 서비스까지 전체 고객 경험을 디자인했다.",
    },
    thumbnail: "/thumbs/bakeshop-thumb.webp",
    // Renders through `BusinessCasePage` — see `content/business-cases`.
    hasCaseStudy: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

/** Cards for the scroll-driven accordion. */
export const PROJECT_CARDS = PROJECTS.filter((p) => p.group === "project");

/**
 * The brands, linked from the foot of about.
 *
 * These had a section of their own on the main page. They still have their own
 * pages — nothing here changed but where they are announced from — so this
 * stays a list of projects rather than of cards.
 */
export const BUSINESS_PROJECTS = PROJECTS.filter((p) => p.group === "business");
