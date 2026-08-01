"use client";

import { useState } from "react";
import { PixelIcon } from "./PixelIcon";
import { chevronIcon } from "@/lib/pixel-icons";

// Below md, the nav links collapse into a dropdown instead of always being
// expanded at the top of the page. At md and above, they're always shown.
export function CollapsibleNav({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 font-ui text-xs font-semibold tracking-widest text-ink-soft uppercase hover:text-green-deep md:hidden"
      >
        menu
        <PixelIcon
          pattern={chevronIcon}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <nav className={`${open ? "flex" : "hidden"} flex-col gap-1 md:flex`}>{children}</nav>
    </div>
  );
}
