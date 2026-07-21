import Image from "next/image";

export function Avatar({ size = 64, src }: { size?: number; src?: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt="avery's avatar"
        width={size}
        height={size}
        className="shrink-0 rounded-full border-4 border-border object-cover"
      />
    );
  }

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-green-pale font-ui font-bold text-green-deep"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      a
    </span>
  );
}
