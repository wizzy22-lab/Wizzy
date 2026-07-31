import { existsSync } from "node:fs";
import { join } from "node:path";
import type { BusinessCase } from "./types";

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

export function resolvePhotos(businessCase: BusinessCase): BusinessCase {
  return {
    ...businessCase,
    hero: {
      ...businessCase.hero,
      image: businessCase.hero.image
        ? { ...businessCase.hero.image, src: resolve(businessCase.hero.image.src) }
        : null,
    },
    built: {
      ...businessCase.built,
      photos: businessCase.built.photos.map((photo) => ({
        ...photo,
        src: resolve(photo.src),
      })),
    },
  };
}
