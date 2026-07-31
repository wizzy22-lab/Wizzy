import Image from "next/image";
import type { Dictionary } from "@/content/dictionaries";
import { TIMELINE_PHOTOS } from "@/content/timeline";

export default function HowIGotHereSection({ dict }: { dict: Dictionary }) {
  const { timeline } = dict;

  return (
    <section id="resume" className="w-full scroll-mt-[99px] bg-background py-32 font-sans">
      <div className="mx-auto w-full max-w-[1920px] px-6 md:px-16 xl:px-[180px] 2xl:px-[360px]">
        <h2 className="text-center font-serif text-[clamp(40px,3.3vw,64px)] tracking-[-0.05em] text-accent">
          {timeline.title}
        </h2>

        <div className="mt-20 flex flex-col gap-14">
          {timeline.items.map((item, i) => {
            // Zigzag: odd rows (1st, 3rd, 5th) sit in the right lane, even rows in the left lane.
            const rightLane = i % 2 === 0;
            const photo = TIMELINE_PHOTOS[i];
            return (
              <div key={i} className="relative flex flex-col gap-4 lg:block">
                {/* Year — fixed at the far left */}
                <div className="text-xl text-sky lg:absolute lg:left-0 lg:top-1 lg:text-2xl">
                  {item.year}
                </div>

                {/* Image + text block — shifts left/right per row */}
                <div
                  className={`flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-7 ${
                    rightLane ? "lg:ml-[288px]" : "lg:ml-[188px]"
                  }`}
                >
                  {/* Photo — falls back to the dashed placeholder if a row has no image yet */}
                  <div className="relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-white/5">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={item.title}
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xs tracking-[0.1em] text-muted">PHOTO</span>
                    )}
                  </div>

                  {/* Text */}
                  <div className="min-w-0 max-w-[560px]">
                    <h3 className="font-serif text-2xl font-semibold tracking-[-0.04em] text-white/90">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-lg leading-[1.5] text-muted">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
