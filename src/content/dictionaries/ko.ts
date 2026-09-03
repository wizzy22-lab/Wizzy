import type { Dictionary } from "./en";

/**
 * Typed against `en.ts`, so a missing key is a compile error.
 *
 * NOTE: the legacy site shipped an EN/KO toggle on the main page but never any
 * Korean copy for it (`index.html` had zero `data-ko` attributes). Everything
 * below is a first-pass translation and should be reviewed in Haeji's own voice.
 */
const ko: Dictionary = {
  meta: {
    title: "Wizzy — 프로덕트 디자이너",
    description: "비즈니스 문제를 성장하는 제품으로 바꿉니다.",
  },

  brand: {
    name: "Wizzy",
    role: "프로덕트 디자이너",
  },

  nav: {
    project: "프로젝트",
    about: "소개",
    resume: "이력서",
    contact: "연락처",
    menu: "메뉴",
  },

  hero: {
    // Korean reverses the English word order, so the rotating phrase carries its
    // own object particle and the tail completes the sentence.
    eyebrow: "저는",
    phrases: ["비즈니스 문제를", "복잡한 운영을", "사용자의 불편을"],
    tail: ["성장하는 제품으로 바꿉니다"],
    mediaAlt: "디바이스 목업 위의 Shoot Shoot Penguin 앱 화면",
    // Left in English on both locales — a mono uppercase affordance, not prose.
    scrollHint: "scroll",
  },

  projects: {
    label: "프로젝트",
    viewCase: "케이스 스터디 보기",
  },

  intro: {
    greeting: "안녕하세요, 프로덕트 디자이너",
    name: "wizzy",
    statement: ["실제 운영과 사용자 행동에 기반한", "제품을 디자인합니다"],
    closingLead: "제가 가장 중요하게 생각하는 것은",
    closing: { before: "진짜", after: "의미 있는 것" },
  },

  // 한 로케일에 한 표기만 — 로마자 표기는 EN 쪽이 맡습니다.
  about: {
    name: "위해지",
    photoAlt: "작업 중인 모습",
    brandsLead: "브랜드를 직접 만들고 운영한 경험 더 보기",
    lead: "현실과 디지털 사이의 간극을 줄이는 일이 프로덕트 디자이너의 몫이라고 생각합니다.",
    approach:
      "매장을 운영할 때는 매출과 손님의 반응을 보며 다음 결정을 내렸고, 지금은 사용자 행동과 테스트 결과를 보며 판단합니다. 디자인은 취향이 아니라 판단이라고 생각해서, 만들기 전에 기준부터 세웁니다.",
  },

  timeline: {
    title: "지금까지의 여정",
    items: [
      {
        year: "2026–현재",
        title: "실제 임팩트를 만드는 일",
        description:
          "브랜드 리뉴얼과 제품 개발을 이끌며 UX 사고를 실제 제품에 적용하고 있습니다.",
      },
      {
        year: "2025",
        title: "UX/UI 디자인으로 전환",
        description:
          "졸업 후 UX/UI 디자인으로 전환해 Blossom UX School에서 프로덕트 사고와 UX 방법론을 공부했습니다.",
      },
      {
        year: "2022",
        title: "Wizzy Bakeshop 창업",
        description:
          "Wizzy Bakeshop을 런칭해 제품 개발, 매장 운영, 고객 경험 전반을 이끌었습니다.",
      },
      {
        year: "2020–2021",
        title: "전문가 과정",
        description: "서울의 베이커리에서 일하며 베이킹을 전문가 수준으로 끌어올렸습니다.",
      },
      {
        year: "2018",
        title: "항해학·해상무역·해사법규 전공",
        description:
          "복잡하고 실패 비용이 큰 환경에서 구조적으로 판단하는 훈련을 받았고, 지금도 디자인 문제에 접근하는 방식의 바탕이 되고 있습니다.",
      },
      {
        year: "2016",
        title: "베이킹을 만나다",
        description:
          "취미로 시작한 베이킹을 진지한 기술로 발전시켰습니다 — 호기심이 몰입으로 이어지는, 이후로도 계속 반복된 패턴이었습니다.",
      },
    ],
  },

  testimonials: {
    title: { lead: "사람들이", muted: "전하는 말" },
    // TODO: 실제 추천사로 교체 — Figma와 동일하게 플레이스홀더가 반복됩니다.
    items: [
      {
        quote:
          "졸업 후 UX/UI 디자인으로 전환해 Blossom UX School에서 프로덕트 사고와 UX 방법론을 공부했습니다.",
        name: "Josua",
        role: "developer · groundvisi",
      },
      {
        quote:
          "졸업 후 UX/UI 디자인으로 전환해 Blossom UX School에서 프로덕트 사고와 UX 방법론을 공부했습니다.",
        name: "Josua",
        role: "developer · groundvisi",
      },
      {
        quote:
          "졸업 후 UX/UI 디자인으로 전환해 Blossom UX School에서 프로덕트 사고와 UX 방법론을 공부했습니다.",
        name: "Josua",
        role: "developer · groundvisi",
      },
      {
        quote:
          "졸업 후 UX/UI 디자인으로 전환해 Blossom UX School에서 프로덕트 사고와 UX 방법론을 공부했습니다.",
        name: "Josua",
        role: "developer · groundvisi",
      },
    ],
  },

  caseStudy: {
    back: "전체 프로젝트로",
    inProgress: {
      title: "케이스 스터디 준비 중",
      body: "이 프로젝트는 아직 케이스 스터디가 작성되지 않았습니다. 우선 어떤 프로젝트였는지 소개합니다.",
    },
    nextProject: "다음 프로젝트",
  },

  footer: {
    connect: "연결",
    getInTouch: "연락하기",
    resume: "이력서",
    location: "위치",
    locationValue: "서울, 대한민국",
    copied: "복사했습니다",
    // The mark stays lowercase Latin in both locales.
    copyright: "© 2026 wizzy",
  },
};

export default ko;
