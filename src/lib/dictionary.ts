export type WordType = "root" | "compound";

// N = noun, Q = qualifier, V = verb, C = circumstantial.
export type PartOfSpeech = "N" | "Q" | "V" | "C";

export interface Definition {
  partOfSpeech: PartOfSpeech;
  meaning: string;
}

export interface DictionaryEntry {
  kawaba: string;
  type: WordType;
  definitions: Definition[];
}

// Definitions are always displayed in this order, regardless of storage order.
const PART_OF_SPEECH_ORDER: PartOfSpeech[] = ["N", "Q", "V", "C"];

export function sortedDefinitions(entry: DictionaryEntry): Definition[] {
  return [...entry.definitions].sort(
    (a, b) =>
      PART_OF_SPEECH_ORDER.indexOf(a.partOfSpeech) -
      PART_OF_SPEECH_ORDER.indexOf(b.partOfSpeech),
  );
}

// Sample entries — replace with your real dictionary. Use type: "root" for
// base morphemes and type: "compound" for words built from more than one root.
export const dictionary: DictionaryEntry[] = [
  {
    kawaba: "ba",
    type: "root",
    definitions: [
      { partOfSpeech: "N", meaning: "part, piece, portion, fraction, section, component, segment, division" },
    ],
  },
  {
    kawaba: "da",
    type: "root",
    definitions: [
      { partOfSpeech: "N", meaning: "thing, matter, material, substance, object, entity, item, stuff" },
      { partOfSpeech: "Q", meaning: "physical, material, tangible, concrete" },
    ],
  },
  {
    kawaba: "ka",
    type: "root",
    definitions: [
      { partOfSpeech: "N", meaning: "kind, type, sort, category, class, variety" },
    ],
  },
  {
    kawaba: "kawaba",
    type: "compound",
    definitions: [
      { partOfSpeech: "N", meaning: "Kawaba, the language of parts" }
    ],
  },
  {
    kawaba: "la",
    type: "root",
    definitions: [
      { partOfSpeech: "N", meaning: "person, human, individual, being, people" },
      { partOfSpeech: "V", meaning: "speak, talk, say, tell, communicate" },
    ],
  },
  {
    kawaba: "lawa",
    type: "compound",
    definitions: [
      { partOfSpeech: "N", meaning: "speaker, lecturer, orator" }
    ],
  },
  {
    kawaba: "lawa-kawaba",
    type: "compound",
    definitions: [
      { partOfSpeech: "N", meaning: "Kawaba speaker" }
    ],
  },
  {
    kawaba: "wa",
    type: "root",
    definitions: [
      { partOfSpeech: "N", meaning: "speech, speaking, communication" },
      { partOfSpeech: "V", meaning: "speak, talk, say, tell, communicate" },
    ],
  },
];
