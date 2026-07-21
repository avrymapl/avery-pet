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
    glyphs[name] = fs.readFileSync(path.join(GLYPHS_DIR, file), "utf-8");
  }
  return glyphs;
}
