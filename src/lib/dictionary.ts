export type WordType = "root" | "compound";

// N = noun, Q = qualifier, V = verb, C = circumstantial. Interjection senses
// aren't abbreviated to a letter — some compounds double as interjections,
// and that sense is spelled out in full like the marker categories.
export type WordClass = "interjection" | "N" | "Q" | "V" | "C";

export const WORD_CLASS_NAMES: Record<WordClass, string> = {
  N: "noun",
  Q: "qualifier",
  V: "verb",
  C: "circumstantial",
  interjection: "interjection",
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
const WORD_CLASS_ORDER: WordClass[] = ["interjection", "N", "Q", "V", "C"];

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
    kawaba: "a",
    type: "marker",
    category: "word class prefix",
    meaning: "noun marker",
    gloss: "N",
  },
  {
    kawaba: "ba",
    type: "root",
    gloss: "part",
    definitions: [
      { wordClass: "N", meaning: "part, piece, portion, fraction, section, component, segment, division" },
    ],
  },
  {
    kawaba: "da",
    type: "root",
    gloss: "thing",
    definitions: [
      { wordClass: "N", meaning: "thing, matter, material, substance, object, entity, item, stuff" },
      { wordClass: "Q", meaning: "physical, material, tangible, concrete" },
    ],
  },
  {
    kawaba: "du",
    type: "root",
    gloss: "big",
    definitions: [
      { wordClass: "Q", meaning: "big, large" },
    ],
  },
  {
    kawaba: "e",
    type: "marker",
    category: "word class prefix",
    meaning: "qualifier marker",
    gloss: "Q",
  },
  {
    kawaba: "ga",
    type: "root",
    gloss: "near",
    definitions: [
      { wordClass: "Q", meaning: "near, close, adjacent" },
    ],
  },
  {
    kawaba: "i",
    type: "marker",
    category: "word class prefix",
    meaning: "verb marker",
    gloss: "V",
  },
  {
    kawaba: "je",
    type: "root",
    gloss: "thing",
    definitions: [
      { wordClass: "N", meaning: "feel, experience, sense, perceive" },
      { wordClass: "Q", meaning: "feeling, experience, sensation, perception" },
    ],
  },
  {
    kawaba: "jemu",
    type: "compound",
    definitions: [
      { wordClass: "interjection", meaning: "hello! (general greeting)" },
      { wordClass: "N", meaning: "happiness, contentment, love, joy" },
      { wordClass: "Q", meaning: "happy, content, joyful" },
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
    kawaba: "kawa",
    type: "compound",
    definitions: [
      { wordClass: "N", meaning: "language, dialect, accent" }
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
    kawaba: "ko",
    type: "root",
    gloss: "small",
    definitions: [
      { wordClass: "Q", meaning: "small, little" }
    ],
  },
  {
    kawaba: "la",
    type: "root",
    gloss: "person",
    definitions: [
      { wordClass: "N", meaning: "person, human, individual, being, people" },
    ],
  },
  {
    kawaba: "ladu",
    type: "compound",
    definitions: [
      { wordClass: "N", meaning: "adult, senior, elder" },
    ],
  },
  {
    kawaba: "lako",
    type: "compound",
    gloss: "",
    definitions: [
      { wordClass: "N", meaning: "child, youth, infant, baby, kid" },
    ],
  },
  {
    kawaba: "lawa",
    type: "compound",
    definitions: [
      { wordClass: "N", meaning: "speaker, lecturer, orator" },
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
    kawaba: "mu",
    type: "root",
    gloss: "good",
    definitions: [
      { wordClass: "Q", meaning: "good, pleasant, positive, beneficial" },
    ],
  },
  {
    kawaba: "o",
    type: "marker",
    category: "word class prefix",
    meaning: "numeral marker",
    gloss: "NUM",
  },
  {
    kawaba: "pu",
    type: "root",
    gloss: "bad",
    definitions: [
      { wordClass: "Q", meaning: "bad, unpleasant, negative, detrimental" },
    ],
  },
  {
    kawaba: "pun",
    type: "root",
    gloss: "animal",
    definitions: [
      { wordClass: "N", meaning: "animal, creature, beast" },
    ],
  },
  {
    kawaba: "punga",
    type: "compound",
    definitions: [
      { wordClass: "N", meaning: "dog, canine" },
    ],
  },
  {
    kawaba: "so",
    type: "root",
    gloss: "time",
    definitions: [
      { wordClass: "N", meaning: "time, period, duration" },
    ],
  },
  {
    kawaba: "sodu",
    type: "compound",
    definitions: [
      { wordClass: "N", meaning: "age, era, epoch" },
      { wordClass: "Q", meaning: "old, aged, ancient" },
    ],
  },
  {
    kawaba: "soko",
    type: "compound",
    definitions: [
      { wordClass: "N", meaning: "moment, instant" },
      { wordClass: "Q", meaning: "brief, shortly" },
    ],
  },
  {
    kawaba: "u",
    type: "marker",
    category: "word class prefix",
    meaning: "circumstantial marker",
    gloss: "C",
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
    kawaba: "wi",
    type: "root",
    gloss: "some",
    definitions: [
      { wordClass: "N", meaning: "amount, quantity" },
      { wordClass: "V", meaning: "some, multiple, " },
    ],
  },
];

// Morpheme (root or marker) -> short gloss, keyed for glyph tooltip lookups.
export const morphemeGlosses: Record<string, string> = {};
for (const entry of dictionary) {
  if (entry.type !== "compound" && entry.gloss) {
    morphemeGlosses[entry.kawaba] = entry.gloss;
  }
}
