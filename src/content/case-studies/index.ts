import type { CaseStudy } from "./types";
import { operatorCaseStudy } from "./operator";

const CASE_STUDIES: Record<string, CaseStudy> = {
  [operatorCaseStudy.slug]: operatorCaseStudy,
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES[slug];
}

export type { CaseStudy, Block, BlockRole, CaseStudySection } from "./types";
