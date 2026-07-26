import type { Dictionary } from "@/content/dictionaries";

export default function WordsFromPeopleSection({ dict }: { dict: Dictionary }) {
  const { testimonials } = dict;

  return (
    <section className="w-full bg-background py-32 font-sans">
      <div className="mx-auto w-full max-w-[1920px] px-6 md:px-16 xl:px-[180px] 2xl:px-[360px]">
        <h2 className="font-serif text-[clamp(40px,3.3vw,64px)] tracking-[-0.05em]">
          <span className="text-accent">{testimonials.title.accent}</span>{" "}
          <span className="text-muted">{testimonials.title.muted}</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {testimonials.items.map((item, i) => (
            <figure key={i} className="flex min-h-[360px] flex-col rounded-xl bg-white/5 p-6">
              <blockquote className="text-lg leading-[1.5] text-white/85">
                {item.quote}
              </blockquote>

              <figcaption className="mt-auto pt-8">
                <p className="text-base text-sky">{item.name}</p>
                <p className="mt-1 text-xs text-muted">{item.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
