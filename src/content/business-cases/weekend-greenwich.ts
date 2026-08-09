import type { BusinessCase } from "./types";

/**
 * Weekend Greenwich — the F&B brand Haeji is renewing as a freelance brand
 * director, alongside its department-store expansion.
 *
 * Same rules as `wizzy-bakeshop.ts`: Korean is the source copy and the English
 * is a faithful translation, kept 1:1 on every number and claim (200–300%
 * dessert growth, 3 + 1 department stores across 2 pop-ups, ~6% vendor and ~15%
 * department-store fees, under 10 sales a week, 30 minutes of baking).
 *
 * Photos live under `public/projects/weekend-greenwich/`. The blocks sit either
 * side of the cases: the POS and cost records set up the data story before it
 * is told, while the butter-tteok and department-store photos are evidence for
 * stories already told, so they close the page instead.
 */

const PHOTOS = "/projects/weekend-greenwich";

export const weekendGreenwichCase: BusinessCase = {
  slug: "weekend-greenwich",

  hero: {
    title: { en: "Weekend Greenwich", ko: "Weekend Greenwich" },
    subtitle: {
      en: "An F&B brand whose renewal and department-store expansion I am leading as a freelance brand director",
      ko: "프리랜서 Brand Director로 리뉴얼과 백화점 확장을 이끌고 있는 F&B 브랜드",
    },
    meta: [
      {
        label: { en: "Role", ko: "역할" },
        value: {
          en: "Brand Director (Freelance)",
          ko: "Brand Director (Freelance)",
        },
      },
      {
        label: { en: "Duration", ko: "기간" },
        value: { en: "Mar 2026 – present", ko: "2026.3 – 현재" },
      },
      {
        label: { en: "Commitment", ko: "근무" },
        value: { en: "3 days a week", ko: "주 3일" },
      },
      {
        label: { en: "Scope", ko: "범위" },
        value: {
          en: "Menu, packaging, pricing",
          ko: "메뉴/패키지/가격 총괄",
        },
      },
    ],
    keyFact: {
      value: { en: "200–300%", ko: "200~300%" },
      label: {
        en: "Dessert category revenue growth",
        ko: "디저트 카테고리 매출 성장",
      },
    },
    lead: {
      en: "It opened in 2023 as a New York–style café and found its footing, but after passing through several hands its signature menu and brand identity had blurred. I joined to reassemble the brand through data and menu structure.",
      ko: "2023년 뉴욕 감성 카페로 시작해 자리를 잡았지만, 여러 작업자를 거치며 시그니처 메뉴와 브랜드 정체성이 흐려진 상태였습니다. 저는 데이터와 메뉴 구조로 브랜드를 다시 조립하는 역할로 합류했습니다.",
    },
    image: {
      src: `${PHOTOS}/wg-product-01.webp`,
      // Shot portrait, so it takes the centred frame rather than a letterbox.
      ratio: "square",
      alt: {
        en: "Cookies cooling on wire racks, each tray labelled by flavour in handwriting",
        ko: "식힘망 위에 놓인 쿠키들, 트레이마다 손글씨 맛 표시가 세워져 있다",
      },
    },
  },

  blocks: [
    // The two records the data story rests on: the POS that started it, and
    // the cost sheets it produced. Both shot portrait.
    {
      title: { en: "Reassembled on Data", ko: "데이터로 다시 조립" },
      columns: 2,
      ratio: "portrait",
      captions: "label",
      photos: [
        {
          src: `${PHOTOS}/wg-pos-01.webp`,
          alt: {
            en: "The Toss POS terminal on the counter, the café's tables and windows behind it",
            ko: "카운터 위의 토스포스 단말기, 뒤로 매장 테이블과 창이 보인다",
          },
          caption: { en: "Toss POS brought in", ko: "토스포스 도입" },
        },
        {
          src: `${PHOTOS}/wg-data-01.webp`,
          alt: {
            en: "A cost and recipe sheet, deliberately blurred",
            ko: "의도적으로 흐리게 처리한 원가·배합 시트",
          },
          caption: {
            en: "Operating records (details withheld)",
            ko: "운영 데이터 기록 (상세 비공개)",
          },
        },
      ],
    },
  ],

  cases: {
    title: { en: "Cases", ko: "사례" },
    items: [
      {
        title: {
          en: "Reassembled on data, not instinct",
          ko: "감이 아니라 데이터로 다시 조립",
        },
        steps: [
          {
            label: { en: "Data first", ko: "데이터 도입" },
            body: {
              en: "The first thing I did after joining was bring in the Toss POS and start recording revenue and menu data, with a data review every month. It changed the basis for decisions from “a feeling” to “a record.”",
              ko: "합류 후 가장 먼저 토스 포스를 도입해 매출과 메뉴 데이터를 기록하기 시작했고, 매달 데이터 리뷰를 실시했습니다. 판단의 기준을 “느낌”에서 “기록”으로 바꾼 것입니다.",
            },
          },
          {
            label: { en: "Menu structure", ko: "메뉴 구조" },
            body: {
              en: "I fixed the standing menu after checking the full inventory, then turned leftover ingredients into guerrilla event items announced on Instagram. Stock gets used up, and customers get a reason to come in.",
              ko: "전체 재고를 확인한 뒤 고정 메뉴를 확정하고, 잔여 재료는 게릴라 이벤트 메뉴로 만들어 인스타그램으로 알렸습니다. 재고는 소진되고, 손님에게는 방문할 이유가 생기는 구조입니다.",
            },
          },
          {
            label: { en: "Drinks rework", ko: "음료 개편" },
            body: {
              en: "Once I had POS revenue data over three months and one month, I pulled any drink selling fewer than 10 times a week. As the menu got simpler, ordering got simpler with it.",
              ko: "3개월·1개월 단위 포스 매출 데이터를 확보한 뒤, 주 10회 미만으로 팔리는 음료를 철수했습니다. 메뉴가 간소해지자 발주도 함께 간소해졌습니다.",
            },
          },
          {
            label: { en: "Brunch", ko: "브런치 도입" },
            body: {
              en: "Given the location and the size of the shop, brunch requests kept coming in. It wasn’t a quantitative metric, but the frequency of spoken requests confirmed the need, so I designed the menu within what the current kitchen could actually produce and made the menu sheet itself. Extending the opening hours and rearranging staffing brought in a new morning crowd.",
              ko: "매장 입지와 규모상 브런치 요청이 반복적으로 들어왔습니다. 정량 지표는 아니었지만 구두 요청의 빈도로 니즈를 확인했고, 현재 주방 여건에서 제조 가능한 범위로 메뉴를 설계해 메뉴판까지 제작했습니다. 영업시간을 확대하고 인력 배치를 재구성해 오전 손님층을 새로 확보했습니다.",
            },
          },
          {
            label: { en: "Result", ko: "성과" },
            body: {
              en: "Dessert category revenue grew 200–300% · a new morning customer base",
              ko: "디저트 카테고리 매출 200~300% 성장 · 오전 고객층 신규 확보",
            },
          },
        ],
      },
      {
        title: {
          en: "The butter-tteok pop-up — between a hit and a failure",
          ko: "버터떡 팝업 — 대박과 실패 사이",
        },
        steps: [
          {
            label: { en: "Learning the channel", ko: "유통 학습" },
            body: {
              en: "Running 2 pop-ups across 3 department stores plus 1, I learned the distribution structure from scratch — pitching for a spot and submitting the proposal, and the vendor companies that sit between a department store and a shop (typically ~6% vendor fee, ~15% department store).",
              ko: "백화점 3곳+1곳, 총 2회의 팝업을 진행하며 유통 구조를 처음부터 배웠습니다 — 입점 제안과 제안서 제출, 그리고 백화점과 매장을 잇는 벤더사의 존재까지 (통상 벤더 수수료 ~6%, 백화점 ~15%).",
            },
          },
          {
            label: { en: "Situation", ko: "상황" },
            body: {
              en: "The biggest lesson came from a failure. In the middle of the viral dessert wave at the time, and at the department store’s strong request, we went in with a single-item butter-tteok pop-up.",
              ko: "가장 큰 배움은 실패에서 왔습니다. 당시 바이럴 디저트 열풍 속에서, 백화점 측의 강한 요청으로 버터떡 단일 품목 팝업에 들어갔습니다.",
            },
          },
          {
            label: { en: "Week 1", ko: "1주차" },
            body: {
              en: "People lined up to buy it, and we ran short on quantity every day.",
              ko: "줄을 서서 사갔고, 매일 수량이 모자랐습니다.",
            },
          },
          {
            label: { en: "Scaling up", ko: "확장" },
            body: {
              en: "In week 2 we signed to expand the pop-up to 3 locations, and since our own output couldn’t cover it we switched to factory production — a contract signed after checking the samples.",
              ko: "2주차에 팝업을 3곳으로 늘리는 계약을 했고, 자체 생산량으로는 감당이 안 돼 공장 생산으로 전환했습니다 — 샘플 확인까지 마친 계약이었습니다.",
            },
          },
          {
            label: { en: "Collapse", ko: "붕괴" },
            body: {
              en: "The factory’s mass-produced goods were clearly lower in quality than the samples, and in the meantime the viral moment cooled before it lasted two weeks. After ending the contract early, I rented a workspace and produced through the night myself to hold the department store delivery schedule. Labor, logistics, equipment costs and leftover stock on top — a painful loss.",
              ko: "공장 양산품은 샘플보다 품질이 확연히 낮았고, 그 사이 바이럴은 2주를 넘기지 못하고 식었습니다. 계약을 조기 종료한 뒤 작업실을 빌려 밤새 직접 생산하며 백화점 납품 기간을 지켰습니다. 인건비·물류비·설비 비용과 재고까지 — 뼈아픈 손실이었습니다.",
            },
          },
          {
            label: { en: "Anatomy of the failure", ko: "실패의 구조 분석" },
            body: {
              en: "① Raw material variance — flour is uniform, but glutinous rice flour differs in particle size and moisture by manufacturer, which made quality hard to predict. ② Production bottleneck — 30 minutes to bake; the ingredient cost was low but the time cost was high. ③ Irreversible pricing — the consumer price was locked to the low starting price of the viral phase, so the margin structure couldn’t be walked back. ④ Demand has a shelf life — viral demand cooled faster than a supply chain could be built.",
              ko: "① 원재료 변동성 — 밀가루는 균질하지만 찹쌀가루는 제조사마다 입자·수분이 달라 품질 예측이 어려웠습니다 ② 생산 병목 — 굽는 데 30분, 재료 원가는 낮아도 시간 비용이 컸습니다 ③ 가격의 비가역성 — 바이럴 초기의 낮은 시작가에 소비자 가격이 고정돼 마진 구조를 되돌릴 수 없었습니다 ④ 수요의 유통기한 — 바이럴 수요는 공급망을 세우는 속도보다 빨리 식었습니다.",
            },
          },
          {
            label: { en: "In one sentence", ko: "한 문장" },
            body: {
              en: "I learned through a loss that what decides a business is not how appealing the product is, but the structure of production, price, and demand.",
              ko: "제품의 매력이 아니라 생산·가격·수요의 구조가 사업의 성패를 정한다는 것을, 손실로 배웠습니다.",
            },
          },
        ],
      },
      {
        title: {
          en: "What transferred, and what didn’t",
          ko: "이식된 것과, 이식되지 않은 것",
        },
        steps: [
          {
            label: { en: "Transferred", ko: "이식된 것" },
            body: {
              en: "From Bakeshop, I connected the supplier network (ingredients, packaging) directly, which cut setup costs, and reused the process of costing out and then deriving the right price. The standard for composing a menu is the same too — it has to keep, cost little, and be producible on a fixed schedule.",
              ko: "Bakeshop에서 거래처 네트워크(재료·패키지)를 그대로 연결해 세팅 비용을 줄였고, 원가 계산 → 적정 가격 산출 프로세스를 재사용했습니다. 메뉴 구성 기준도 같습니다 — 보관 가능하고, 원가가 낮고, 고정 생산이 가능한 것.",
            },
          },
          {
            label: { en: "Didn’t transfer", ko: "이식되지 않은 것" },
            body: {
              en: "Bakeshop’s formula for regulars doesn’t work here. A director rather than an owner has different latitude in service, three days a week means a different density of rapport, and a trade area built around customers arriving by car has a different repeat-visit structure than a neighborhood one. The same know-how has to be redesigned when the context changes — the most design-like lesson I took from operations.",
              ko: "Bakeshop의 단골 공식은 여기서 작동하지 않았습니다. 오너가 아닌 디렉터는 서비스 재량이 다르고, 주 3일 근무로는 라포의 밀도가 다르며, 차량 방문 중심 상권은 동네 상권과 재방문 구조 자체가 다릅니다. 같은 노하우도 맥락이 바뀌면 다시 설계해야 한다 — 운영에서 배운 가장 디자인적인 교훈입니다.",
            },
          },
          {
            label: { en: "Still open", ko: "남아 있는 문제" },
            body: {
              en: "In a non-resident director setup, ordering authority and execution sit apart, so inventory loss keeps recurring. It remains a question of authority structure — one a system rework alone doesn’t solve.",
              ko: "비상주 디렉터 구조에서는 발주 권한과 실행이 분리되어 재고 로스가 반복됩니다. 시스템 개편만으로는 풀리지 않는, 권한 구조의 문제로 남아 있습니다.",
            },
          },
        ],
      },
    ],
  },

  closingBlocks: [
    // The butter-tteok run in the order it happened: the week-1 queue, the
    // counter it sold from, the delivery packing the scale-up forced, and the
    // booth at the end of it.
    {
      title: {
        en: "Anatomy of the Butter-Tteok Failure",
        ko: "버터떡 실패 해부",
      },
      columns: 3,
      ratio: "portrait",
      captions: "label",
      video: {
        src: `${PHOTOS}/wg-queue-loop.mp4`,
        poster: `${PHOTOS}/wg-queue-poster.webp`,
        alt: {
          en: "Customers queueing at the butter-tteok pop-up counter in a department store food hall",
          ko: "백화점 식품관 버터떡 팝업 매대 앞에 줄을 선 손님들",
        },
        caption: {
          en: "Week 1 — the queue at the department store pop-up",
          ko: "1주차 — 백화점 팝업 대기줄",
        },
      },
      photos: [
        {
          src: `${PHOTOS}/wg-popup-06.webp`,
          alt: {
            en: "Boxed butter-tteok stacked on the pop-up counter behind BUTTER DDEOK price cards",
            ko: "BUTTER DDEOK 가격 안내판 뒤로 포장된 버터떡이 쌓인 팝업 매대",
          },
          caption: { en: "The pop-up display", ko: "팝업 진열" },
        },
        {
          src: `${PHOTOS}/wg-popup-03.webp`,
          alt: {
            en: "Butter-tteok boxed and bagged on a prep table, each bag tagged BUTTER DDEOK",
            ko: "작업대 위에 포장된 버터떡, 봉투마다 BUTTER DDEOK 택이 붙어 있다",
          },
          caption: { en: "Packed for delivery", ko: "납품 포장" },
        },
        {
          src: `${PHOTOS}/wg-popup-04.webp`,
          alt: {
            en: "The BUTTER DDEOK pop-up counter stacked with boxed tteok under its price cards and standing sign",
            ko: "가격 안내판과 입간판 아래 포장된 버터떡이 쌓인 BUTTER DDEOK 팝업 매대",
          },
          caption: { en: "The pop-up booth", ko: "팝업 부스" },
        },
      ],
    },

    {
      title: { en: "Distribution Expansion", ko: "유통 확장" },
      columns: 1,
      ratio: "landscape",
      captions: "label",
      photos: [
        {
          src: `${PHOTOS}/wg-popup-05.webp`,
          alt: {
            en: "The full department store booth seen down the food hall aisle, staff restocking behind it",
            ko: "식품관 통로에서 바라본 백화점 부스 전경, 뒤에서 직원이 상품을 채우고 있다",
          },
          caption: {
            en: "The department store booth",
            ko: "백화점 부스 전경",
          },
        },
      ],
    },
  ],

  takeaway: {
    title: { en: "Takeaway", ko: "정리" },
    paragraphs: [
      {
        text: {
          en: "Three days a week, I am still running this brand and working through the open questions above. Producing results inside someone else’s business, with limited authority and limited time — that is what this project is teaching me.",
          ko: "지금도 주 3일, 이 브랜드를 운영하며 위의 숙제들을 풀고 있습니다. 남의 비즈니스에서 제한된 권한과 시간으로 성과를 만드는 일 — 그것이 이 프로젝트가 저에게 가르치고 있는 것입니다.",
        },
      },
    ],
    next: {
      href: "/projects/wizzy-bakeshop",
      label: {
        en: "The brand where the operating instinct started — Wizzy Bakeshop",
        ko: "운영의 시작점이 된 브랜드 — Wizzy Bakeshop",
      },
    },
  },
};
