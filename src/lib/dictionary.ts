export type WordType = "root" | "compound";

// N = noun, Q = qualifier, V = verb, C = circumstantial.
export type WordClass = "N" | "Q" | "V" | "C";

export const WORD_CLASS_NAMES: Record<WordClass, string> = {
  N: "noun",
  Q: "qualifier",
  V: "verb",
  C: "circumstantial",
};

export interface Definition {
  wordClass: WordClass;
  meaning: string;
}

export interface LexicalEntry {
  kawaba: string;
  type: WordType;
  definitions: Definition[];
  // Short interlinear gloss for a root morpheme, shown as a tooltip when
  // hovering its glyph. Not displayed in the dictionary listing itself.
  gloss?: string;
}

// Grammatical markers aren't lexical roots and don't carry a word class of
// their own — they're categorized instead by their grammatical function.
export type MarkerCategory =
  | "word class prefix"
  | "prepositional prefix"
  | "clausal particle"
  | "conjunction";

export interface MarkerEntry {
  kawaba: string;
  type: "marker";
  category: MarkerCategory;
  meaning: string;
  gloss?: string;
}

export type DictionaryEntry = LexicalEntry | MarkerEntry;

// Word classes are always displayed in this order, regardless of storage order.
const WORD_CLASS_ORDER: WordClass[] = ["N", "Q", "V", "C"];

export function sortedDefinitions(entry: LexicalEntry): Definition[] {
  return [...entry.definitions].sort(
    (a, b) => WORD_CLASS_ORDER.indexOf(a.wordClass) - WORD_CLASS_ORDER.indexOf(b.wordClass),
  );
}

// Meanings to search or display for an entry, regardless of its shape.
export function entryMeanings(entry: DictionaryEntry): string[] {
  return entry.type === "marker" ? [entry.meaning] : entry.definitions.map((def) => def.meaning);
}

// Sample entries — replace with your real dictionary. Use type: "root" for
// base morphemes, type: "compound" for words built from more than one root,
// and type: "marker" for grammatical formatives (word class prefixes,
// prepositional prefixes, clausal particles, and conjunctions).
export const dictionary: DictionaryEntry[] = [
  {
    kawaba: "ba",
    type: "root",
    gloss: "part",
    definitions: [
      { wordClass: "N", meaning: "part, piece, portion, fraction, section, component, segment, division" },
    ],
  },
  {
    kawaba: "a",
    type: "root",
    gloss: "part",
    definitions: [
      { partOfSpeech: "N", meaning: "part, piece, portion, fraction, section, component, segment, division" },
    ],
  },
  {
    kawaba: "da",
    type: "root",
    gloss: "thing",
    definitions: [
      { partOfSpeech: "N", meaning: "thing, matter, material, substance, object, entity, item, stuff" },
      { partOfSpeech: "Q", meaning: "physical, material, tangible, concrete" },
    ],
  },
  {
    kawaba: "ka",
    type: "root",
    gloss: "kind of",
    definitions: [
      { wordClass: "N", meaning: "kind, type, sort, category, class, variety" },
    ],
  },
  {
    kawaba: "kawaba",
    type: "compound",
    definitions: [
      { wordClass: "N", meaning: "Kawaba, the language of parts" }
    ],
  },
  {
    kawaba: "la",
    type: "root",
    gloss: "person",
    definitions: [
      { wordClass: "N", meaning: "person, human, individual, being, people" },
      { wordClass: "V", meaning: "speak, talk, say, tell, communicate" },
    ],
  },
  {
    kawaba: "lawa",
    type: "compound",
    definitions: [
      { wordClass: "N", meaning: "speaker, lecturer, orator" }
    ],
  },
  {
    kawaba: "lawa-kawaba",
    type: "compound",
    definitions: [
      { wordClass: "N", meaning: "Kawaba speaker" }
    ],
  },
  {
    kawaba: "wa",
    type: "root",
    gloss: "speak",
    definitions: [
      { wordClass: "N", meaning: "speech, speaking, communication" },
      { wordClass: "V", meaning: "speak, talk, say, tell, communicate" },
    ],
  },
  {
    kawaba: "a",
    type: "marker",
    category: "word class prefix",
    meaning: "marks the following root as a noun",
    gloss: "N",
  },
  {
    kawaba: "i",
    type: "marker",
    category: "word class prefix",
    meaning: "marks the following root as a verb",
    gloss: "V",
  },
  {
    kawaba: "ta",
    type: "marker",
    category: "prepositional prefix",
    meaning: "at, in (locative)",
    gloss: "LOC",
  },
  {
    kawaba: "pe",
    type: "marker",
    category: "clausal particle",
    meaning: "marks a yes/no question",
    gloss: "INT",
  },
  {
    kawaba: "ne",
    type: "marker",
    category: "conjunction",
    meaning: "and, additionally",
    gloss: "and",
  },
];

// Morpheme (root or marker) -> short gloss, keyed for glyph tooltip lookups.
export const morphemeGlosses: Record<string, string> = {};
for (const entry of dictionary) {
  if (entry.type !== "compound" && entry.gloss) {
    morphemeGlosses[entry.kawaba] = entry.gloss;
  }
}
