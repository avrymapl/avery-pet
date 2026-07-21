import type { PixelPattern } from "@/lib/pixel-icons";

export function PixelIcon({
  pattern,
  pixelSize = 2,
  className,
}: {
  pattern: PixelPattern;
  pixelSize?: number;
  className?: string;
}) {
  const cols = pattern[0]?.length ?? 0;

  return (
    <span
      aria-hidden
      className={`inline-grid shrink-0 align-middle ${className ?? ""}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${pixelSize}px)`,
        gridTemplateRows: `repeat(${pattern.length}, ${pixelSize}px)`,
      }}
    >
      {pattern.flatMap((row, y) =>
        row.split("").map((cell, x) => (
          <span
            key={`${x}-${y}`}
            style={{ background: cell === "#" ? "currentColor" : "transparent" }}
          />
        )),
      )}
    </span>
  );
}
