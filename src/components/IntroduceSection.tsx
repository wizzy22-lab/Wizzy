import type { Dictionary } from "@/content/dictionaries";

export default function IntroduceSection({ dict }: { dict: Dictionary }) {
  const { intro } = dict;

  return (
    <section id="about" className="w-full scroll-mt-[99px] bg-background py-28 font-sans">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col items-center px-6 text-center">
        <p className="text-[clamp(20px,2.2vw,32px)] font-semibold tracking-[-0.05em] text-muted">
          {intro.greeting}
        </p>

        <p className="mt-2 font-serif text-[clamp(40px,3.3vw,64px)] tracking-[-0.05em] text-accent">
          {intro.name}
        </p>

        <p className="mt-2 text-[clamp(20px,2.2vw,32px)] font-semibold leading-[1.2] tracking-[-0.05em] text-muted">
          {intro.statement.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>

        <p className="mt-2 text-[clamp(20px,2.2vw,32px)] font-bold tracking-[-0.05em] text-muted">
          {intro.closingLead}
        </p>

        <p className="mt-7 font-serif text-[clamp(40px,3.3vw,64px)] tracking-[-0.05em] text-sky">
          {intro.closing.before}{" "}
          <span style={{ fontFamily: "var(--font-cormorant)" }}>&amp;</span>{" "}
          {intro.closing.after}
        </p>
      </div>
    </section>
  );
}
