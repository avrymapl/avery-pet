// Import and export of .bf files, including the cell-label header.
//
// Brainfuck has no comment syntax: every non-command byte in a file is simply
// ignored, which means any metadata we write is still part of the program.
// The header is safe only because it contains none of the eight command
// characters — that's also why labels themselves must not contain them, or a
// newline, which would break the line-oriented shape of the header.

import { COMMAND_CHARS, isCommand } from "./machine";

export type Labels = Map<number, string>;

/**
 * Why a proposed label is invalid, as a user-facing message, or null when
 * it's fine.
 */
export function labelError(label: string): string | null {
  if (/[\n\r]/.test(label)) {
    return "labels can't contain newlines – they're saved one per line in the header of exported .bf files";
  }
  for (const ch of label) {
    if (isCommand(ch)) {
      return `labels can't contain ${COMMAND_CHARS.split("").join(" ")} – brainfuck has no comments, so the label header in an exported .bf file is executed with the program, and any command character in it would change what the program does`;
    }
  }
  return null;
}

/**
 * Serialises a program and its labels to .bf file contents. The header is
 * only written when labels exist, so an unlabelled program round-trips
 * byte-for-byte.
 */
export function exportBf(source: string, labels: Labels): string {
  const entries = [...labels.entries()]
    .filter(([, label]) => label.length > 0)
    .sort(([a], [b]) => a - b);
  if (entries.length === 0) return source;
  const lines = entries.map(([index, label]) => `  ${index}=${label}`).join("\n");
  return `cell labels\n\n${lines}\n\n${source}`;
}

export interface ImportedBf {
  source: string;
  labels: Labels;
}

// The label class excludes \r explicitly so CRLF files parse: the stray \r
// belongs to the line ending, not the label.
const ENTRY_PATTERN = /^\s+(\d+)=([^\r\n]+)\r?$/;

/**
 * Parses .bf file contents, recovering the label header when the file starts
 * with one of the expected shape. Anything else — including any valid .bf
 * file from elsewhere — imports unchanged with no labels. The header is only
 * stripped when it contains no command characters, so stripping it can never
 * alter what the program does.
 */
export function importBf(text: string): ImportedBf {
  const noLabels: ImportedBf = { source: text, labels: new Map() };

  const lines = text.split("\n");
  if (lines[0]?.trim() !== "cell labels") return noLabels;

  let i = 1;
  while (i < lines.length && lines[i].trim() === "") i++;
  const labels: Labels = new Map();
  while (i < lines.length) {
    const match = ENTRY_PATTERN.exec(lines[i]);
    if (!match) break;
    labels.set(Number(match[1]), match[2]);
    i++;
  }
  if (labels.size === 0) return noLabels;
  while (i < lines.length && lines[i].trim() === "") i++;

  const header = lines.slice(0, i).join("\n");
  for (const ch of header) {
    if (isCommand(ch)) return noLabels;
  }
  return { source: lines.slice(i).join("\n"), labels };
}
