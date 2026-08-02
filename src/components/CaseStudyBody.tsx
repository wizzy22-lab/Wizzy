import Image from "next/image";
import { t, type Locale } from "@/lib/i18n";
import type { Block, CaseStudy } from "@/content/case-studies";

/**
 * Renders the preserved semantic blocks of a case study.
 *
 * This is a structural pass, not a port of the legacy page's bespoke art
 * direction — every string and image is here, styled by role. The intent is
 * that the presentation can be rebuilt without the content ever moving again.
 */

/** Multi-line strings arrived as `\n` from the source markup. */
function Lines({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
    </>
  );
}

const PARAGRAPH_STYLES: Partial<Record<Block["role"], string>> = {
  body: "max-w-[820px] text-body text-dim",
  cardBody: "text-body text-text",
  defineBody: "max-w-[820px] text-body text-dim",
  featureBody: "max-w-[820px] text-body text-dim",
  reflectBody: "max-w-[820px] text-body text-dim",
  resultBody: "text-body text-text",
  kpiDesc: "text-body text-dim",
  diagramSub: "text-body text-dim",
};

function BlockView({ block, locale }: { block: Block; locale: Locale }) {
  if (block.role === "image") {
    return (
      <figure className="my-10 overflow-hidden rounded-2xl border border-border bg-surface">
        <Image
          src={block.src}
          alt={block.alt}
          width={1600}
          height={1000}
          sizes="(max-width: 1024px) 100vw, 960px"
          className="h-auto w-full object-contain"
        />
      </figure>
    );
  }

  const text = t(block.text, locale);

  switch (block.role) {
    case "groupLabel":
      return (
        <p className="mt-24 type-label text-dim first:mt-0">{text}</p>
      );

    case "subLabel":
      return (
        <p className="mt-16 type-label text-faint">{text}</p>
      );

    case "h2":
      return (
        <h2 className="mt-6 max-w-[900px] text-heading text-accent">
          <Lines text={text} />
        </h2>
      );

    case "h3":
      return (
        <h3 className="mt-8 max-w-[860px] text-heading text-text">
          <Lines text={text} />
        </h3>
      );

    case "insight":
      return (
        <p className="my-6 max-w-[820px] border-l-2 border-accent/60 pl-5 text-body text-accent">
          <Lines text={text} />
        </p>
      );

    case "insightLabel":
    case "cardLabel":
    case "flowLabel":
    case "kpiLabel":
    case "diagramLabel":
    case "resultLabel":
      return (
        <p className="mt-8 type-label text-dim">{text}</p>
      );

    case "cardTitle":
    case "featureTitle":
    case "reflectTitle":
      return (
        <h4 className="mt-8 text-heading font-medium text-text">
          <Lines text={text} />
        </h4>
      );

    case "listItem":
    case "featureBullet":
    case "flowStep":
      return (
        <li className="ml-5 list-disc text-body text-dim marker:text-dim">
          <Lines text={text} />
        </li>
      );

    case "featureNum":
    case "defineNum":
      return (
        <p className="mt-10 text-heading text-accent/70">{text}</p>
      );

    case "defineKey":
      return <p className="mt-6 text-body font-medium text-text">{text}</p>;

    default:
      return (
        <p className={`mt-4 ${PARAGRAPH_STYLES[block.role] ?? "text-body text-dim"}`}>
          <Lines text={text} />
        </p>
      );
  }
}

const LIST_ROLES = new Set<Block["role"]>(["listItem", "featureBullet", "flowStep"]);

/** Consecutive bullet blocks belong in one <ul>; everything else renders inline. */
function groupBlocks(blocks: Block[]): { list: boolean; blocks: Block[] }[] {
  return blocks.reduce<{ list: boolean; blocks: Block[] }[]>((groups, block) => {
    const isList = LIST_ROLES.has(block.role);
    const last = groups[groups.length - 1];
    if (last && last.list === isList) last.blocks.push(block);
    else groups.push({ list: isList, blocks: [block] });
    return groups;
  }, []);
}

export default function CaseStudyBody({
  caseStudy,
  locale,
}: {
  caseStudy: CaseStudy;
  locale: Locale;
}) {
  return (
    <>
      {caseStudy.sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-[120px]">
          {groupBlocks(section.blocks).map((group, gi) => {
            const items = group.blocks.map((block, i) => (
              <BlockView key={`${section.id}-${gi}-${i}`} block={block} locale={locale} />
            ));
            return group.list ? (
              <ul key={`${section.id}-${gi}`} className="mt-4 flex flex-col gap-2">
                {items}
              </ul>
            ) : (
              <div key={`${section.id}-${gi}`}>{items}</div>
            );
          })}
        </section>
      ))}
    </>
  );
}
