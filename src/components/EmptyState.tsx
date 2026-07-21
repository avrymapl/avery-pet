import { PixelIcon } from "./PixelIcon";
import { starIcon } from "@/lib/pixel-icons";

export function EmptyState({ category }: { category: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-border px-5 py-6 text-ink-soft">
      <PixelIcon pattern={starIcon} className="text-green" />
      <p>nothing filed under {category} yet — check back soon.</p>
    </div>
  );
}
