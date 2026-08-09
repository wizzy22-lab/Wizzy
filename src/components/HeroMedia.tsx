import Image from "next/image";

/**
 * The hero's media slot.
 *
 * A fixed frame — surface matte, the same `rounded-[var(--radius-card)]` the project covers use
 * — holding whatever is currently standing in for the brand film. Right now
 * that is a still; passing `video` swaps it for a looping clip without the
 * frame, the matte, or the layout around it changing at all.
 *
 * The frame is sized off the viewport height rather than its width, because it
 * shares the first screen with the headline and the scroll hint: it takes what
 * is left over, and never pushes them out.
 */
export default function HeroMedia({
  src,
  alt,
  video,
}: {
  /** Still shown in the slot — the poster once `video` is set. */
  src: string;
  alt: string;
  /** A looping clip to play in place of the still. */
  video?: string;
}) {
  return (
    <div className="relative aspect-square h-[min(320px,30vh)] w-[min(320px,30vh)] overflow-hidden rounded-[var(--radius-card)] bg-surface">
      {video ? (
        // Muted, looping and inline — a moving still, not a player.
        <video
          src={video}
          poster={src}
          aria-label={alt}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          preload
          sizes="320px"
          className="object-cover"
        />
      )}
    </div>
  );
}
