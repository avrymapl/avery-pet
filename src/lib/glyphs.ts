import fs from "fs";
import path from "path";

const GLYPHS_DIR = path.join(process.cwd(), "public", "glyphs");

// Server-only: reads every morpheme glyph's raw SVG markup so it can be
// inlined directly (rather than loaded via <img>), which lets glyphs drawn
// with fill="currentColor" pick up the surrounding text color.
export function getGlyphMarkup(): Record<string, string> {
  let files: string[] = [];
  try {
    files = fs.readdirSync(GLYPHS_DIR).filter((file) => file.endsWith(".svg"));
  } catch {
    return {};
  }

  const glyphs: Record<string, string> = {};
  for (const file of files) {
    const name = file.slice(0, -".svg".length);
    const svg = fs.readFileSync(path.join(GLYPHS_DIR, file), "utf-8");
    // The glyphs are drawn in Inkscape with a hardcoded black stroke/fill
    // rather than currentColor, so swap it in here to match the surrounding
    // text color instead of always rendering black.
    glyphs[name] = svg.replace(/(stroke|fill):#000000/g, "$1:currentColor");
  }
  return glyphs;
}
