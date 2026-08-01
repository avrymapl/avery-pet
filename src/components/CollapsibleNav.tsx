"use client";

import { PixelIcon } from "./PixelIcon";
import { chevronIcon } from "@/lib/pixel-icons";

// Toggle for the mobile nav dropdown, meant to sit inline with a sidebar's
// heading text. Hidden at md and above, where the nav is always expanded.
export function CollapsibleNavToggle({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-label="toggle menu"
      className="ml-auto shrink-0 text-ink-soft hover:text-green-deep md:hidden"
    >
      <PixelIcon
        pattern={chevronIcon}
        className={`transition-transform ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}

// Below md, the nav links collapse into a dropdown instead of always being
// expanded at the top of the page. At md and above, they're always shown.
// onNavigate fires on any click inside (e.g. selecting a link) so the caller
// can close the dropdown — a no-op on desktop, where it's always open anyway.
export function CollapsibleNav({
  open,
  onNavigate,
  children,
}: {
  open: boolean;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <nav onClick={onNavigate} className={`${open ? "flex" : "hidden"} flex-col gap-1 md:flex`}>
      {children}
    </nav>
  );
}
