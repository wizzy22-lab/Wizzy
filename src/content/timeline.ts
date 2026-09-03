/**
 * Photos for the "How I got here" timeline.
 *
 * Locale-neutral, so they live here rather than in the dictionaries — the alt
 * text comes from each row's translated title instead. Order matters: entry `i`
 * pairs with `dict.timeline.items[i]`, so keep this list in sync with the items
 * in `dictionaries/en.ts` (and their Korean mirrors) if rows are added,
 * removed, or reordered.
 *
 * Newest first, like the rows — a new entry goes at the top of both lists, not
 * the bottom.
 */
export const TIMELINE_PHOTOS = [
  "/about/timeline-06-leading-impact.jpg", // 2026–present — Leading Real-World Impact
  "/about/timeline-05-ux-transition.jpg", // 2025 — Transitioned into UX/UI Design
  "/about/timeline-04-founded-bakeshop.jpg", // 2022 — Founded Wizzy Bakeshop
  "/about/timeline-03-trained-professionally.jpg", // 2020–2021 — Trained Professionally
  "/about/timeline-01-navigation.jpg", // 2018 — Studied Navigation
  "/about/timeline-02-discovered-baking.jpg", // 2016 — Discovered Baking
];
