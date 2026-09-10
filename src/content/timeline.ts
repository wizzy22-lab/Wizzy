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
 *
 * `null` is a row with no photo, and the hole is kept rather than closed up
 * precisely because the pairing is positional: dropping the entry would shift
 * every row below it onto the wrong picture, and the alt text with it. The
 * band renders nothing at all for a `null` — no tile, no placeholder — so the
 * gap exists here and nowhere on the page.
 *
 * Two of the six are `null` now. Both were food rather than work: a scone and
 * a tray of cupcakes, against a band that otherwise shows the making of
 * things. The rows they belong to keep their year, title and description; it
 * is only the picture that goes, and the files stay in `public/about/`.
 */
export const TIMELINE_PHOTOS: (string | null)[] = [
  "/about/timeline-06-leading-impact.jpg", // 2026–present — Leading Real-World Impact
  "/about/timeline-05-ux-transition.jpg", // 2025 — Transitioned into UX/UI Design
  "/about/timeline-04-founded-bakeshop.jpg", // 2022 — Founded Wizzy Bakeshop
  null, // 2020–2021 — Trained Professionally (was timeline-03-trained-professionally.jpg)
  "/about/timeline-01-navigation.jpg", // 2018 — Studied Navigation
  null, // 2016 — Discovered Baking (was timeline-02-discovered-baking.jpg)
];
