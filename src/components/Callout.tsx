import { PixelIcon } from "./PixelIcon";
import { starIcon } from "@/lib/pixel-icons";

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <aside className="callout">
      <PixelIcon pattern={starIcon} className="callout-icon text-green" />
      <div>{children}</div>
    </aside>
  );
}
