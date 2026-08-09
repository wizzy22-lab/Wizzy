import { existsSync } from "node:fs";
import { join } from "node:path";
import type { BusinessCase, BusinessCasePhotoBlock } from "./types";

/**
 * A case is authored with every photo path it expects, but the photos land in
 * the repo later than the copy does. Rather than shipping a broken `<img>` for
 * a file that isn't there yet, this checks `public/` at build time and nulls
 * out the paths that are missing — `BusinessCasePage` then draws an empty slot
 * in that spot, and the case keeps its layout.
 *
 * Drop the file in under the name the case already references and it renders
 * on the next build; no content edit needed.
 *
 * Server-only: the pages that call this are statically generated, so the check
 * runs at build time and never in the browser.
 */

function resolve(src: string | null): string | null {
  if (!src) return null;
  return existsSync(join(process.cwd(), "public", src)) ? src : null;
}

function resolveBlock(block: BusinessCasePhotoBlock): BusinessCasePhotoBlock {
  return {
    ...block,
    photos: block.photos.map((photo) => ({ ...photo, src: resolve(photo.src) })),
    ...(block.video && {
      video: {
        ...block.video,
        src: resolve(block.video.src),
        poster: resolve(block.video.poster),
      },
    }),
  };
}

export function resolvePhotos(businessCase: BusinessCase): BusinessCase {
  const { blocks, closingBlocks } = businessCase;

  return {
    ...businessCase,
    hero: {
      ...businessCase.hero,
      image: businessCase.hero.image
        ? { ...businessCase.hero.image, src: resolve(businessCase.hero.image.src) }
        : null,
    },
    ...(blocks && { blocks: blocks.map(resolveBlock) }),
    ...(closingBlocks && { closingBlocks: closingBlocks.map(resolveBlock) }),
  };
}
