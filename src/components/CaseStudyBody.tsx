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
  body: "max-w-[820px] text-lg leading-[1.6] text-muted",
  cardBody: "text-lg leading-[1.6] text-white/85",
  defineBody: "max-w-[820px] text-lg leading-[1.6] text-muted",
  featureBody: "max-w-[820px] text-lg leading-[1.6] text-muted",
  reflectBody: "max-w-[820px] text-lg leading-[1.6] text-muted",
  resultBody: "text-lg leading-[1.6] text-white/85",
  kpiDesc: "text-lg leading-[1.6] text-muted",
  diagramSub: "text-base leading-[1.6] text-muted",
};

function BlockView({ block, locale }: { block: Block; locale: Locale }) {
  if (block.role === "image") {
    return (
      <figure className="my-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
        <p className="mt-24 text-sm uppercase tracking-[0.2em] text-sky first:mt-0">{text}</p>
      );

    case "subLabel":
      return (
        <p className="mt-16 text-xs uppercase tracking-[0.2em] text-muted/70">{text}</p>
      );

    case "h2":
      return (
        <h2 className="mt-6 max-w-[900px] font-serif text-[clamp(28px,3vw,44px)] leading-[1.25] tracking-[-0.03em] text-accent">
          <Lines text={text} />
        </h2>
      );

    case "h3":
      return (
        <h3 className="mt-8 max-w-[860px] font-serif text-[clamp(22px,2vw,32px)] leading-[1.3] tracking-[-0.03em] text-white/90">
          <Lines text={text} />
        </h3>
      );

    case "insight":
      return (
        <p className="my-6 max-w-[820px] border-l-2 border-accent/60 pl-5 text-lg leading-[1.6] text-accent">
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
        <p className="mt-8 text-sm uppercase tracking-[0.14em] text-sky">{text}</p>
      );

    case "cardTitle":
    case "featureTitle":
    case "reflectTitle":
      return (
        <h4 className="mt-8 text-xl font-semibold tracking-[-0.02em] text-white/90">
          <Lines text={text} />
        </h4>
      );

    case "listItem":
    case "featureBullet":
    case "flowStep":
      return (
        <li className="ml-5 list-disc text-lg leading-[1.6] text-muted marker:text-sky">
          <Lines text={text} />
        </li>
      );

    case "featureNum":
    case "defineNum":
      return (
        <p className="mt-10 font-serif text-3xl tracking-[-0.03em] text-accent/70">{text}</p>
      );

    case "defineKey":
      return <p className="mt-6 text-lg font-semibold text-white/90">{text}</p>;

    default:
      return (
        <p className={`mt-4 ${PARAGRAPH_STYLES[block.role] ?? "text-lg leading-[1.6] text-muted"}`}>
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
