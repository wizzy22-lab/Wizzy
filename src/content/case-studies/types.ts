import type { Localized } from "@/lib/i18n";

/**
 * Semantic roles carried over from the legacy site's case-study markup.
 * They describe what a block *is*, not how it looks, so the presentation layer
 * can be rebuilt without touching the content.
 */
export type BlockRole =
  | "groupLabel" // section eyebrow: "Overview", "Approach"
  | "subLabel" // sub-section eyebrow: "Primary Research"
  | "h2"
  | "h3"
  | "body"
  | "cardLabel"
  | "cardTitle"
  | "cardBody"
  | "insightLabel"
  | "insight" // pull-quote / key finding
  | "listItem"
  | "featureNum"
  | "featureTitle"
  | "featureBody"
  | "featureBullet"
  | "resultLabel"
  | "resultBody"
  | "defineNum"
  | "defineKey"
  | "defineBody"
  | "diagramLabel"
  | "diagramSub"
  | "flowLabel"
  | "flowStep"
  | "kpiLabel"
  | "kpiDesc"
  | "reflectTitle"
  | "reflectBody";

export type Block =
  | { role: BlockRole; text: Localized }
  | { role: "image"; src: string; alt: string };

export type CaseStudySection = {
  id: string;
  blocks: Block[];
};

export type CaseStudy = {
  slug: string;
  hero: {
    image: string | null;
    tag: Localized;
    headline: Localized;
    description: Localized;
    meta: { label: Localized; value: Localized }[];
  };
  sections: CaseStudySection[];
};
