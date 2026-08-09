import type { BusinessCase } from "./types";
import { weekendGreenwichCase } from "./weekend-greenwich";
import { wizzyBakeshopCase } from "./wizzy-bakeshop";

const BUSINESS_CASES: Record<string, BusinessCase> = {
  [weekendGreenwichCase.slug]: weekendGreenwichCase,
  [wizzyBakeshopCase.slug]: wizzyBakeshopCase,
};

/**
 * A project slug renders through `BusinessCasePage` instead of the standard
 * case-study layout when it has an entry here.
 */
export function getBusinessCase(slug: string): BusinessCase | undefined {
  return BUSINESS_CASES[slug];
}

export { resolvePhotos } from "./assets";

export type {
  BusinessCase,
  BusinessCaseCard,
  BusinessCaseMeta,
  BusinessCasePhoto,
  BusinessCasePhotoBlock,
  BusinessCasePhotoRatio,
  BusinessCaseStep,
  BusinessCaseVideo,
} from "./types";
