import type { Dictionary } from "@/content/dictionaries";

export default function WordsFromPeopleSection({ dict }: { dict: Dictionary }) {
  const { testimonials } = dict;

  return (
    <section className="w-full bg-bg py-32 font-sans">
      <div className="mx-auto w-full max-w-[1920px] px-6 md:px-16 xl:px-[180px] 2xl:px-[360px]">
        <h2 className=" text-heading">
          <span className="text-text">{testimonials.title.lead}</span>{" "}
          <span className="text-dim">{testimonials.title.muted}</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {testimonials.items.map((item, i) => (
            <figure key={i} className="flex min-h-[360px] flex-col rounded-[var(--radius-card)] bg-surface p-6">
              <blockquote className="text-body text-text">
                {item.quote}
              </blockquote>

              <figcaption className="mt-auto pt-8">
                <p className="text-body text-dim">{item.name}</p>
                <p className="mt-1 type-label text-dim">{item.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
