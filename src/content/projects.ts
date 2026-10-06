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
   * The open card's bold line under the name — what the work set out to do, in
   * one sentence. Project cards only; the brands are not drawn as cards.
   */
  headline?: Localized;
  /**
   * One line of outcome, in numbers where there are numbers. Kept for the
   * brands. The project cards fold their numbers into the description instead.
   */
  outcome?: Localized;
  tags: Localized[];
  description: Localized;
  /**
   * Square (1:1) thumbnail shown in the accordion, cropped to fill. The project
   * ones are exported whole from the card frames in Figma at 2×. `null` leaves
   * the slot empty rather than drawing a stand-in.
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
    slug: "shoot-shoot-penguin",
    group: "project",
    no: "01",
    name: "Shoot Shoot Penguin",
    subtitle: {
      en: "AI-Assisted Basketball Team Management Platform",
      ko: "AI 기반 농구팀 운영 플랫폼",
    },
    headline: {
      en: "One shared UI system that keeps running the team apart from playing the game",
      ko: "운영과 경기의 역할을 분리한 공용 UI 시스템",
    },
    // Tags are English in both locales — they are discipline names, and the
    // Korean card in Figma sets them that way.
    tags: [
      { en: "Design System", ko: "Design System" },
      { en: "Dual-Sided Platform", ko: "Dual-Sided Platform" },
      { en: "End-to-End", ko: "End-to-End" },
    ],
    description: {
      en: "In a two-sided basketball app, I set the roles and rules of the UI so organisers can manage quickly and players can read match information at a glance. The design system runs through to code, so it held during development too.",
      ko: "양면 구조의 농구 앱에서 운영자는 빠르게 관리하고, 플레이어는 직관적으로 경기 정보를 이해할 수 있도록 UI의 역할과 규칙을 설계했습니다. 디자인 시스템을 코드까지 연결해 개발 과정에서도 일관되게 적용했습니다.",
    },
    thumbnail: "/thumbs/ssp-card.webp",
    hasCaseStudy: false,
    externalUrl: "https://shoot-shoot-penguin.vercel.app/",
  },
  {
    slug: "operator",
    group: "project",
    no: "02",
    name: "Operator",
    subtitle: {
      en: "HVAC Cost Optimization for Small Businesses",
      ko: "자영업자를 위한 냉난방 비용 최적화 시스템",
    },
    headline: {
      en: "Complex HVAC decisions, turned into simple actions",
      ko: "복잡한 냉난방 판단을 간단한 행동으로",
    },
    tags: [
      { en: "AI Recommendations", ko: "AI Recommendations" },
      { en: "Decision Support", ko: "Decision Support" },
      { en: "Product Design", ko: "Product Design" },
    ],
    description: {
      en: "Simplified the decision so owners can read where things stand from store conditions and cost data, and pick the action they need straight away. Usability testing cut the required inputs from 7 to 3.",
      ko: "매장 환경과 비용 데이터를 바탕으로 현재 상태를 파악하고 필요한 조치를 바로 선택할 수 있도록 의사결정 과정을 단순화했습니다. 사용성 테스트를 통해 필수 입력을 7개에서 3개로 줄였습니다.",
    },
    thumbnail: "/thumbs/operator-card.webp",
    hasCaseStudy: true,
    externalUrl: "https://wizzy-s-portfolio.vercel.app/projects/operator.html",
  },
  {
    slug: "bingx",
    group: "project",
    no: "03",
    name: "Bing X - AI Trading",
    subtitle: {
      en: "AI Trading Decision Flow Redesign",
      ko: "AI 트레이딩 의사결정 플로우 리디자인",
    },
    headline: {
      en: "A decision flow that lets people understand AI auto-trading before they choose it",
      ko: "AI 자동매매를 이해하고 선택할 수 있는 의사결정 경험",
    },
    tags: [
      { en: "AI UX", ko: "AI UX" },
      { en: "Decision Support", ko: "Decision Support" },
      { en: "Onboarding - Structure", ko: "Onboarding - Structure" },
    ],
    description: {
      en: "Moved AI Master away from a simple pick, redesigning onboarding and the way into auto-trading so people can understand a Master and choose one that fits their investment goals. Usability testing scored 88 on SUS.",
      ko: "AI Master를 단순히 선택하는 구조에서 벗어나, 사용자가 자신의 투자 목적에 맞는 Master를 이해하고 선택할 수 있도록 온보딩과 자동매매 진입 흐름을 재설계했습니다. 사용성 테스트를 통해 SUS 88점을 달성했습니다.",
    },
    thumbnail: "/thumbs/bingx-card.webp",
    hasCaseStudy: false,
    externalUrl: "https://bingx-portfolio.vercel.app/",
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
