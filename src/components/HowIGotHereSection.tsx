import Image from "next/image";
import type { Dictionary } from "@/content/dictionaries";
import { TIMELINE_PHOTOS } from "@/content/timeline";

export default function HowIGotHereSection({ dict }: { dict: Dictionary }) {
  const { timeline } = dict;

  return (
    <section
      id="about"
      data-theme="light"
      className="w-full scroll-mt-[70px] bg-bg py-16 font-sans"
    >
      <div className="mx-auto w-full max-w-[1920px] px-6 md:px-16 xl:px-[180px] 2xl:px-[360px]">
        <h2 className="text-center text-heading font-medium text-text">
          {timeline.title}
        </h2>

        {/*
          A list of rows, not a drawn timeline: the years already carry the
          sequence, so the vertical rule, dots and left/right staggering were
          all restating it. Rules between rows do the same job in 1px.
        */}
        <ul className="mt-12 border-b border-border">
          {timeline.items.map((item, i) => (
            <li
              key={i}
              className="grid gap-x-10 gap-y-1 border-t border-border py-4 md:grid-cols-[112px_minmax(0,260px)_minmax(0,1fr)] md:items-baseline"
            >
              <span className="type-label text-dim">{item.year}</span>
              <h3 className="text-body font-medium text-text">{item.title}</h3>
              <p className="text-body text-dim">{item.description}</p>
            </li>
          ))}
        </ul>

        {/*
          Photos leave the rows and regroup as one band of equal tiles. Freed
          from the text they no longer need to be the same height as a
          paragraph, so they can all share one square format.
        */}
        <ul className="mt-12 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {TIMELINE_PHOTOS.map((photo, i) => (
            <li
              key={photo}
              className="relative aspect-square overflow-hidden rounded-xl bg-surface"
            >
              <Image
                src={photo}
                alt={timeline.items[i]?.title ?? ""}
                fill
                sizes="(max-width: 640px) 33vw, 16vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
