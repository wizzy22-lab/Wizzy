import type { BusinessCase } from "./types";

/**
 * Wizzy Bakeshop — the dessert brand Haeji founded and ran for 2 years 2 months.
 *
 * Korean is the source copy; the English is a faithful translation, kept 1:1 on
 * every number and claim (58% returning customers, 70/30 weekly split, the
 * Butter Apple and salt bread outcomes). Nothing is stronger in one language
 * than the other.
 *
 * Photos live under `public/projects/wizzy-bakeshop/`, shot square for the
 * products and 3:4 for the posters and the shop, so each block declares the
 * ratio its own frames use.
 */

const PHOTOS = "/projects/wizzy-bakeshop";

export const wizzyBakeshopCase: BusinessCase = {
  slug: "wizzy-bakeshop",

  hero: {
    title: { en: "Wizzy Bakeshop", ko: "Wizzy Bakeshop" },
    subtitle: {
      en: "A dessert brand I founded and ran for 2 years 2 months, with real revenue as the feedback loop",
      ko: "실제 매출을 피드백 삼아 2년 2개월 운영한 디저트 브랜드",
    },
    meta: [
      { label: { en: "Role", ko: "역할" }, value: { en: "Founder", ko: "Founder" } },
      {
        label: { en: "Scope", ko: "범위" },
        value: {
          en: "Product / Operations / CX",
          ko: "Product / Operations / CX",
        },
      },
      { label: { en: "Duration", ko: "기간" }, value: { en: "2022–2024", ko: "2022–2024" } },
    ],
    keyFact: {
      value: { en: "58%", ko: "58%" },
      label: {
        en: "Returning customers (POS data)",
        ko: "재방문율 (POS 데이터 기준)",
      },
    },
    lead: {
      en: "I started it because I wanted to share something I love, and I learned how to run it by being tested every day — by money and by customers.",
      ko: "좋아하는 것을 나누고 싶어 시작했고, 돈과 손님으로 매일 검증받으며 운영을 배웠습니다.",
    },
    image: {
      src: `${PHOTOS}/bakeshop-product-02.webp`,
      ratio: "square",
      alt: {
        en: "Two Wizzy Bakeshop cakes — one topped with strawberries and edible flowers, one with a chocolate drip",
        ko: "딸기와 식용꽃을 올린 케이크와 초콜릿을 흘려 덮은 케이크, Wizzy Bakeshop 케이크 2종",
      },
    },
  },

  blocks: [
    // Three products, each one the evidence for a case below: the weekly menu
    // system, the group orders, and the gift set. Shot square, so the frames
    // are.
    {
      title: { en: "What I Built", ko: "내가 만든 것" },
      columns: 3,
      ratio: "square",
      captions: "label",
      intro: {
        en: "The moment a dessert becomes a gift, the buyer and the consumer are no longer the same person. The recipient eats it; the buyer judges the packaging. So I redesigned the package, and it led to Lunar New Year gift-set pre-orders.",
        ko: "디저트는 선물되는 순간 구매자와 소비자가 달라집니다. 받는 사람이 먹고, 사는 사람은 포장을 평가합니다. 그래서 패키지를 다시 설계했고, 설 선물세트 예약으로 이어졌습니다.",
      },
      photos: [
        {
          src: `${PHOTOS}/bakeshop-product-01.webp`,
          alt: {
            en: "A tray of cupcakes topped with cream, strawberries and chocolate chips",
            ko: "크림과 딸기, 초코칩을 올린 컵케이크가 담긴 트레이",
          },
          caption: {
            en: "Cupcakes — the 70/30 menu system",
            ko: "컵케이크 — 70/30 메뉴 시스템",
          },
        },
        {
          src: `${PHOTOS}/bakeshop-product-03.webp`,
          alt: {
            en: "Sandwiches packed into takeout boxes for a bulk order",
            ko: "대량 주문용 테이크아웃 용기에 담긴 샌드위치",
          },
          caption: {
            en: "Sandwiches in bulk — group orders",
            ko: "샌드위치 대량 — 단체 주문",
          },
        },
        {
          src: `${PHOTOS}/bakeshop-product-05.webp`,
          alt: {
            en: "Striped gift boxes and a wrapped holiday cake on a plaid cloth",
            ko: "체크 천 위에 놓인 줄무늬 선물 상자와 포장된 홀리데이 케이크",
          },
          caption: {
            en: "Gift packaging — the holiday gift set",
            ko: "선물 패키지 — 명절 선물세트",
          },
        },
      ],
    },

    {
      title: { en: "Brand Graphics", ko: "브랜드 그래픽" },
      // 2×2 — the posters are 3:4, so two per row keeps them readable.
      columns: 2,
      ratio: "portrait",
      captions: "label",
      // One caption for the set: four posters, one job.
      caption: {
        en: "Weekly menu posters I designed",
        ko: "직접 디자인한 주간 메뉴 포스터",
      },
      photos: [
        {
          src: `${PHOTOS}/bakeshop-poster-01.webp`,
          alt: {
            en: "Poster for the sandwich sets — soup set, coffee set and couple set with their prices",
            ko: "샌드위치 세트 포스터 — 수프 세트, 커피 세트, 커플 세트와 가격 안내",
          },
        },
        {
          src: `${PHOTOS}/bakeshop-poster-02.webp`,
          alt: {
            en: "Poster for the sandwich menu — club sandwich, jambon salt bread and the weekly sandwich",
            ko: "샌드위치 메뉴 포스터 — 클럽 샌드위치, 잠봉 소금빵, 주간 샌드위치",
          },
        },
        {
          src: `${PHOTOS}/bakeshop-poster-03.webp`,
          alt: {
            en: "Poster for the holiday cakes — triple berry summer cake, fruits flower cake and the weekly cake",
            ko: "홀리데이 케이크 포스터 — 트리플베리 서머 케이크, 프루츠 플라워 케이크, 주간 케이크",
          },
        },
        {
          src: `${PHOTOS}/bakeshop-poster-04.webp`,
          alt: {
            en: "Poster for the weekly soups — pumpkin, potato and corn",
            ko: "주간 수프 포스터 — 단호박, 감자, 콘 수프",
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
          en: "The 70/30 rule behind 58% returning customers",
          ko: "재방문율 58%를 만든 70/30 규칙",
        },
        steps: [
          {
            label: { en: "Observation", ko: "관찰" },
            body: {
              en: "A neighborhood shop has a fixed pool of customers. On the same menu alone, reasons to visit run out.",
              ko: "동네 매장의 손님은 정해져 있습니다. 같은 메뉴만으로는 방문 이유가 소진됩니다.",
            },
          },
          {
            label: { en: "Judgment", ko: "판단" },
            body: {
              en: "Let the fixed menu carry trust and the new items carry novelty — 70% fixed, 30% new, every week.",
              ko: "신뢰는 고정 메뉴가, 새로움은 신메뉴가 맡게 하자 — 매주 고정 70% + 신메뉴 30%.",
            },
          },
          {
            label: { en: "Action", ko: "실행" },
            body: {
              en: "I put out a new item every week based on seasonal ingredients, and on closing days I posted two candidates for the next week’s menu to an Instagram vote so customers chose it themselves.",
              ko: "계절 재료 기반으로 매주 신메뉴를 냈고, 휴무일에는 다음 주 메뉴 후보 2개를 인스타그램 투표에 올려 손님이 직접 고르게 했습니다.",
            },
          },
          {
            label: { en: "Result", ko: "결과" },
            body: {
              en: "58% of all customers became returning customers (POS data). The confidence that “if Wizzy makes it, this one will be good too” turned a random new item into something to look forward to.",
              ko: "전체 손님의 58%가 재방문 고객이 되었습니다 (POS 데이터 기준). “위지가 만들면 이 메뉴도 맛있다”는 확신이 랜덤 신메뉴를 기대하게 만들었습니다.",
            },
          },
        ],
      },
      {
        title: {
          en: "The Butter Apple failure — a good product was not a product that sells",
          ko: "버터애플의 실패 — 좋은 제품이 팔리는 제품은 아니었습니다",
        },
        steps: [
          {
            label: { en: "Situation", ko: "상황" },
            body: {
              en: "“Butter Apple,” an homage to pineapple cake. Both the look and the taste had real care in them, and I was sure it would do well.",
              ko: "펑리수를 오마주한 ‘버터애플’. 모양도 맛도 정성스러워 잘될 거라 확신했습니다.",
            },
          },
          {
            label: { en: "Reality", ko: "현실" },
            body: {
              en: "The process was handmade, so production efficiency was low, and it sold poorly because the size was small for the price.",
              ko: "수작업 공정이라 생산 효율이 낮았고, 가격 대비 작은 사이즈 때문에 판매가 부진했습니다.",
            },
          },
          {
            label: { en: "Experiment", ko: "실험" },
            body: {
              en: "On the hypothesis that “a taste is what leads to a purchase,” I ran a sampling service. Customers really did come back to buy after tasting — but this time I hadn’t prepared the quantity.",
              ko: "“맛을 봐야 구매로 이어진다”는 가설로 시식 서비스를 돌렸습니다. 실제로 맛보고 구매하러 온 손님이 생겼지만 — 이번엔 수량 준비가 안 되어 있었습니다.",
            },
          },
          {
            label: { en: "Lesson", ko: "배움" },
            body: {
              en: "How finished a product is and how it holds up on productivity and price structure were separate problems. The product was not the good thing itself — it was everything up to the structure that could make it and sell it.",
              ko: "제품의 완성도와 생산성·가격 구조는 별개의 문제였습니다. 좋은 제품이 아니라, 만들 수 있고 팔릴 수 있는 구조까지가 제품이었습니다.",
            },
          },
        ],
      },
      {
        title: {
          en: "The salt bread dilemma — I judged it by the basket, not by unit margin",
          ko: "소금빵의 딜레마 — 단품 마진이 아니라 장바구니로 판단했습니다",
        },
        steps: [
          {
            label: { en: "Situation", ko: "상황" },
            body: {
              en: "In a pastry shop that sells only same-day, salt bread was low-priced and labor-heavy — on margin alone, an item to cut.",
              ko: "당일 판매 원칙의 제과 매장에서 소금빵은 단가도 낮고 손이 많이 가는, 마진만 보면 빼야 할 메뉴였습니다.",
            },
          },
          {
            label: { en: "Observation", ko: "관찰" },
            body: {
              en: "But customers who came for the salt bread bought other desserts along with it.",
              ko: "하지만 손님들은 소금빵을 사러 와서 다른 디저트를 함께 사갔습니다.",
            },
          },
          {
            label: { en: "Judgment", ko: "판단" },
            body: {
              en: "I decided to judge an item’s value by the whole basket it sells with, not by its unit margin. The salt bread stayed.",
              ko: "메뉴의 가치를 단품 마진이 아니라 함께 팔리는 장바구니 전체로 평가하기로 했습니다. 소금빵은 유지.",
            },
          },
          {
            label: { en: "Bonus", ko: "덤" },
            body: {
              en: "Leftover days followed the same standard — I never ran discounts. The idea that “come late and it’s cheap” eats away at a brand. Instead, near closing I would add one more to a customer’s bag: “This one is new — it’s a gift today.” So that surplus stock read not as a negative signal but as a good feeling on the way out.",
              ko: "남는 날의 처리도 같은 기준이었습니다 — 할인 판매는 하지 않았습니다. “늦게 오면 싸다”는 인식은 브랜드를 갉아먹으니까요. 대신 마감 무렵 손님에게 “새로 나온 메뉴예요, 오늘은 선물로 드릴게요”라고 하나씩 더 담았습니다. 잉여 재고가 부정적 신호가 아니라 나갈 때의 좋은 기분이 되도록.",
            },
          },
        ],
      },
    ],
    note: {
      title: { en: "Absorbing a cost increase", ko: "원가 상승 대응" },
      body: {
        en: "When chocolate prices jumped, I didn’t fight the price tag. Because the menu changed every week, items with a high cost share could be swapped for others naturally — the menu system absorbed the price resistance.",
        ko: "초콜릿 가격이 뛰었을 때 가격표와 싸우지 않았습니다. 매주 바뀌는 메뉴 구조 덕분에, 원가 비중이 높은 메뉴를 자연스럽게 다른 메뉴로 대체할 수 있었습니다 — 메뉴 시스템이 가격 저항을 흡수한 것입니다.",
      },
    },
  },

  closingBlocks: [
    // In the order it happened: the fit-out, then open in daylight, then a
    // season on the storefront, then a working evening behind the counter.
    {
      title: { en: "Traces of Operation", ko: "운영의 흔적" },
      columns: 2,
      ratio: "portrait",
      captions: "label",
      photos: [
        {
          src: `${PHOTOS}/bakeshop-store-04.webp`,
          alt: {
            en: "The empty shop during fit-out, with the display case being installed",
            ko: "쇼케이스를 설치 중인 공사 중의 빈 매장",
          },
          caption: { en: "Setting up the space", ko: "매장 셋업 공사" },
        },
        {
          src: `${PHOTOS}/bakeshop-store-01.webp`,
          alt: {
            en: "The shop in daylight, menu posters taped to the window over an autumn street",
            ko: "가을 거리를 향한 창에 메뉴 포스터를 붙인, 낮의 매장 내부",
          },
          caption: { en: "Open, in daylight", ko: "영업 중인 매장, 낮" },
        },
        {
          src: `${PHOTOS}/bakeshop-store-02.webp`,
          alt: {
            en: "The lit storefront at night, dressed with Halloween decorations",
            ko: "핼러윈 장식을 한 밤의 매장 외관",
          },
          caption: { en: "A season, at night", ko: "시즌 야간의 매장" },
        },
        {
          src: `${PHOTOS}/bakeshop-store-06.webp`,
          alt: {
            en: "Reading a pastry reference book at the counter in the evening light",
            ko: "저녁 빛이 드는 매장에서 제과 서적을 보고 있는 모습",
          },
          caption: { en: "At work behind the counter", ko: "매장에서 작업 중" },
        },
      ],
    },
  ],

  takeaway: {
    title: { en: "Takeaway", ko: "정리" },
    paragraphs: [
      {
        text: {
          en: "The customers were users, the revenue was the metric, and each week’s menu was an experiment. Before I learned the word research, I was doing it every day at the register.",
          ko: "손님은 사용자였고, 매출은 지표였고, 매주의 메뉴는 실험이었습니다. 리서치라는 말을 배우기 전에, 저는 매일 계산대에서 그것을 하고 있었습니다.",
        },
      },
      {
        text: {
          en: "I wrapped up the operation when my leave of absence for founding the business ran out and I returned to school. Closing the shop left me with two conclusions.",
          ko: "운영은 창업휴학 기한이 끝나 복학하면서 마무리했습니다. 매장을 정리하며 두 가지 결론이 남았습니다.",
        },
      },
      {
        emphasis: true,
        text: {
          en: "One — the wall of scale. This shop’s regulars were made by my own eye for detail, my hands, and fine-grained service, and that is exactly why it could not scale. Value that stops working without me had to be rebuilt as structure rather than as a person in order to last.",
          ko: "하나 — 확장의 벽. 이 가게의 단골은 저의 관찰력과 손맛, 세밀한 서비스로 만들어진 것이었고, 그래서 확장할 수 없었습니다. 내가 없으면 작동하지 않는 가치를, 지속하려면 사람이 아닌 구조로 만들어야 했습니다.",
        },
      },
      {
        emphasis: true,
        text: {
          en: "Two — the limits of the product category. Dessert disappears after a day; no product is more constrained by storage and distribution. The next product had to be the opposite — software doesn’t disappear once it’s made, has no distribution limit, and can be built from a person’s thinking with little capital. And the cycle of making something quickly, putting it out, and watching the response was exactly the feeling of releasing a new item every week.",
          ko: "둘 — 제품군의 한계. 디저트는 하루가 지나면 사라지는, 보관과 유통의 제약이 가장 큰 제품입니다. 다음 제품은 그 반대여야 했습니다 — 소프트웨어는 한번 만들면 사라지지 않고, 유통에 제약이 없고, 사람의 생각에서 시작해 적은 자본으로 만들 수 있습니다. 그러면서도 빠르게 만들어 내놓고 반응을 보는 사이클은, 매주 신메뉴를 내던 그 감각 그대로였습니다.",
        },
      },
      {
        text: {
          en: "So I changed products. I now solve the same question on a screen — making a good experience something that works for anyone as structure, not as one person’s talent. That is the product design I do.",
          ko: "그래서 제품을 바꿨습니다. 지금 저는 같은 질문을 화면 위에서 풉니다 — 좋은 경험을 한 사람의 재능이 아니라, 누구에게나 작동하는 구조로 만드는 일. 그것이 제가 하는 프로덕트 디자인입니다.",
        },
      },
    ],
    next: {
      href: "https://wizzy-s-portfolio.vercel.app/projects/operator.html",
      label: {
        en: "The project this operating instinct led to — Operator",
        ko: "이 운영 감각에서 출발한 프로젝트 — Operator",
      },
    },
  },
};
