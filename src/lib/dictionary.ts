import { splitMorphemes } from "@/lib/morphemes";

export type WordType = "root" | "compound";

// N = noun, Q = qualifier, V = verb, O = operator, C = circumstantial.
// Interjection senses aren't abbreviated to a letter — some compounds double
// as interjections, and that sense is spelled out in full like the marker
// categories.
export type WordClass = "interjection" | "N" | "Q" | "V" | "O" | "C";

export const WORD_CLASS_NAMES: Record<WordClass, string> = {
  N: "noun",
  Q: "qualifier",
  V: "verb",
  O: "operator",
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
  // Optional note on why a compound's meaning followed from its parts —
  // useful when the connection is a bit of a stretch. Shown in the
  // dictionary listing under the entry's title.
  etymology?: string;
}

// Grammatical markers aren't lexical roots and don't carry a word class of
// their own — they're categorized instead by their grammatical function.
export type MarkerCategory =
  | "word class prefix"
  | "preposition"
  | "clause marker"
  | "conjunction";

export interface MarkerEntry {
  kawaba: string;
  type: "marker";
  category: MarkerCategory;
  meaning: string;
  gloss?: string;
}

export type DictionaryEntry = LexicalEntry | MarkerEntry;

// Word classes are always displayed in this order, regardless of storage
// order. After the interjection, this follows the vowel order of the class
// prefixes themselves: a- e- i- o- u-.
const WORD_CLASS_ORDER: WordClass[] = ["interjection", "N", "Q", "V", "O", "C"];

export function sortedDefinitions(entry: LexicalEntry): Definition[] {
  return [...entry.definitions].sort(
    (a, b) => WORD_CLASS_ORDER.indexOf(a.wordClass) - WORD_CLASS_ORDER.indexOf(b.wordClass),
  );
}

// Meanings to search or display for an entry, regardless of its shape.
export function entryMeanings(entry: DictionaryEntry): string[] {
  return entry.type === "marker" ? [entry.meaning] : entry.definitions.map((def) => def.meaning);
}

// Entries are stored in alphabetical order. Use type: "root" for the 110 base
// morphemes, type: "compound" for words built from more than one root, and
// type: "marker" for the 20 grammatical formatives (word class prefixes,
// prepositions, clause markers, and conjunctions).
export const dictionary: DictionaryEntry[] = [
  {
    kawaba: "a",
    type: "marker",
    category: "word class prefix",
    meaning: "noun marker",
    gloss: "N",
  },
  {
    kawaba: "an",
    type: "marker",
    category: "clause marker",
    meaning: "opens a complement clause — a clause used as a referring expression",
    gloss: "COMP",
  },
  {
    kawaba: "ba",
    type: "root",
    gloss: "part",
    definitions: [
      { wordClass: "N", meaning: "part, piece, portion, fraction, section, component, segment" },
      { wordClass: "Q", meaning: "partial, incomplete, fragmentary" },
      { wordClass: "V", meaning: "make up, comprise, form part of" },
      { wordClass: "C", meaning: "partly, partially, in part" },
    ],
  },
  {
    kawaba: "ban",
    type: "root",
    gloss: "most",
    definitions: [
      { wordClass: "N", meaning: "maximum, peak" },
      { wordClass: "Q", meaning: "greatest, maximal, utmost, supreme" },
      { wordClass: "O", meaning: "most, -est" },
    ],
  },
  {
    kawaba: "be",
    type: "root",
    gloss: "cause",
    definitions: [
      { wordClass: "N", meaning: "cause, reason, source, origin" },
      { wordClass: "Q", meaning: "causal, underlying" },
      { wordClass: "V", meaning: "cause, bring about, lead to, give rise to" },
      { wordClass: "C", meaning: "therefore, consequently, as a result" },
    ],
  },
  {
    kawaba: "ben",
    type: "root",
    gloss: "get",
    definitions: [
      { wordClass: "N", meaning: "acquisition, gain" },
      { wordClass: "V", meaning: "get, receive, obtain, acquire, take" },
    ],
  },
  {
    kawaba: "bi",
    type: "root",
    gloss: "have",
    definitions: [
      { wordClass: "N", meaning: "possession, property, belongings" },
      { wordClass: "Q", meaning: "owned, possessed, held" },
      { wordClass: "V", meaning: "have, possess, own, hold, keep" },
    ],
  },
  {
    kawaba: "bin",
    type: "root",
    gloss: "hole",
    definitions: [
      { wordClass: "N", meaning: "hole, opening, gap, aperture, cavity" },
      { wordClass: "Q", meaning: "open, perforated" },
      { wordClass: "V", meaning: "pierce, bore, open up" },
    ],
  },
  {
    kawaba: "bo",
    type: "root",
    gloss: "before",
    definitions: [
      { wordClass: "N", meaning: "past, front" },
      { wordClass: "Q", meaning: "previous, prior, former, preceding" },
      { wordClass: "V", meaning: "precede, come before, lead" },
      { wordClass: "C", meaning: "before, previously, earlier, beforehand, ago" },
    ],
  },
  {
    kawaba: "bon",
    type: "root",
    gloss: "cloth",
    definitions: [
      { wordClass: "N", meaning: "cloth, fabric, textile, clothing, garment" },
      { wordClass: "Q", meaning: "woven, cloth, textile" },
      { wordClass: "V", meaning: "clothe, dress, drape, cover" },
    ],
  },
  {
    kawaba: "bu",
    type: "root",
    gloss: "make",
    definitions: [
      { wordClass: "N", meaning: "creation, production, construction, making" },
      { wordClass: "Q", meaning: "created, artificial, constructed" },
      { wordClass: "V", meaning: "make, create, produce, build, construct" },
    ],
  },
  {
    kawaba: "bun",
    type: "root",
    gloss: "surface",
    definitions: [
      { wordClass: "N", meaning: "surface, face, exterior, outside, skin" },
      { wordClass: "Q", meaning: "outer, external, surface, superficial" },
      { wordClass: "C", meaning: "on, upon, on top of, over the surface of" },
    ],
  },
  {
    kawaba: "da",
    type: "root",
    gloss: "thing",
    definitions: [
      { wordClass: "N", meaning: "thing, matter, material, substance, object, entity, item, stuff" },
      { wordClass: "Q", meaning: "physical, material, tangible, concrete" },
      { wordClass: "V", meaning: "exist, be real, be there" },
    ],
  },
  {
    kawaba: "dan",
    type: "root",
    gloss: "stop",
    definitions: [
      { wordClass: "N", meaning: "end, cessation, pause" },
      { wordClass: "Q", meaning: "stopped, halted, still" },
      { wordClass: "V", meaning: "stop, halt, cease, end, finish" },
    ],
  },
  {
    kawaba: "de",
    type: "root",
    gloss: "body",
    definitions: [
      { wordClass: "N", meaning: "body, torso, figure" },
      { wordClass: "Q", meaning: "bodily, corporeal, embodied" },
    ],
  },
  {
    kawaba: "den",
    type: "root",
    gloss: "write",
    definitions: [
      { wordClass: "N", meaning: "writing, drawing, text, document" },
      { wordClass: "V", meaning: "write, draw, inscribe, record" },
    ],
  },
  {
    kawaba: "di",
    type: "root",
    gloss: "die",
    definitions: [
      { wordClass: "N", meaning: "death, dying, demise" },
      { wordClass: "Q", meaning: "dead, deceased, lifeless" },
      { wordClass: "V", meaning: "die, perish, pass away" },
    ],
  },
  {
    kawaba: "din",
    type: "root",
    gloss: "stone",
    definitions: [
      { wordClass: "N", meaning: "stone, rock, mineral, ore" },
      { wordClass: "Q", meaning: "stony, rocky, hard" },
    ],
  },
  {
    kawaba: "do",
    type: "root",
    gloss: "come",
    definitions: [
      { wordClass: "N", meaning: "arrival, approach, coming" },
      { wordClass: "V", meaning: "come, arrive, approach" },
    ],
  },
  {
    kawaba: "don",
    type: "root",
    gloss: "female",
    definitions: [
      { wordClass: "N", meaning: "female, woman" },
      { wordClass: "Q", meaning: "female, feminine" },
    ],
  },
  {
    kawaba: "du",
    type: "root",
    gloss: "big",
    definitions: [
      { wordClass: "N", meaning: "size, magnitude, extent, bulk" },
      { wordClass: "Q", meaning: "big, large, great" },
      { wordClass: "V", meaning: "grow, enlarge, expand" },
    ],
  },
  {
    kawaba: "dun",
    type: "root",
    gloss: "stay",
    definitions: [
      { wordClass: "N", meaning: "persistence, permanence, continuation" },
      { wordClass: "Q", meaning: "remaining, lasting, permanent, enduring" },
      { wordClass: "V", meaning: "stay, remain, persist, continue, last" },
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
    kawaba: "en",
    type: "marker",
    category: "clause marker",
    meaning: "opens a relative clause — a clause used as a modifier",
    gloss: "REL",
  },
  {
    kawaba: "ga",
    type: "root",
    gloss: "near",
    definitions: [
      { wordClass: "N", meaning: "nearness, proximity, vicinity" },
      { wordClass: "Q", meaning: "near, close, adjacent" },
      { wordClass: "V", meaning: "approach, come close to" },
      { wordClass: "C", meaning: "nearby, close by" },
    ],
  },
  {
    kawaba: "gan",
    type: "root",
    gloss: "group",
    definitions: [
      { wordClass: "N", meaning: "group, set, collection, gathering" },
      { wordClass: "Q", meaning: "grouped, collective, communal, shared" },
      { wordClass: "V", meaning: "gather, group, collect, assemble" },
    ],
  },
  {
    kawaba: "ge",
    type: "root",
    gloss: "above",
    definitions: [
      { wordClass: "N", meaning: "top, upper part, height, summit" },
      { wordClass: "Q", meaning: "upper, high, top, raised" },
      { wordClass: "V", meaning: "rise, raise, lift" },
      { wordClass: "C", meaning: "above, over, on top, up, overhead" },
    ],
  },
  {
    kawaba: "gen",
    type: "root",
    gloss: "strong",
    definitions: [
      { wordClass: "N", meaning: "strength, force, power, intensity" },
      { wordClass: "Q", meaning: "strong, powerful, forceful, intense" },
      { wordClass: "V", meaning: "strengthen, reinforce, intensify" },
    ],
  },
  {
    kawaba: "gi",
    type: "root",
    gloss: "hear",
    definitions: [
      { wordClass: "N", meaning: "hearing" },
      { wordClass: "V", meaning: "hear, listen to" },
    ],
  },
  {
    kawaba: "gin",
    type: "root",
    gloss: "consume",
    definitions: [
      { wordClass: "N", meaning: "food, drink, meal, nourishment" },
      { wordClass: "Q", meaning: "edible, drinkable" },
      { wordClass: "V", meaning: "consume, eat, drink, ingest" },
    ],
  },
  {
    kawaba: "go",
    type: "root",
    gloss: "below",
    definitions: [
      { wordClass: "N", meaning: "bottom, underside, base" },
      { wordClass: "Q", meaning: "lower, bottom, under, low" },
      { wordClass: "V", meaning: "lower, descend, drop" },
      { wordClass: "C", meaning: "below, under, beneath, underneath, down" },
    ],
  },
  {
    kawaba: "gon",
    type: "root",
    gloss: "water",
    definitions: [
      { wordClass: "N", meaning: "water, liquid, fluid" },
      { wordClass: "Q", meaning: "wet, liquid, damp" },
      { wordClass: "V", meaning: "wet, moisten, water, soak" },
    ],
  },
  {
    kawaba: "gu",
    type: "root",
    gloss: "all",
    definitions: [
      { wordClass: "N", meaning: "whole, entirety, totality, everything" },
      { wordClass: "Q", meaning: "whole, entire, complete, total" },
      { wordClass: "O", meaning: "all, every, each" },
    ],
  },
  {
    kawaba: "gun",
    type: "root",
    gloss: "fight",
    definitions: [
      { wordClass: "N", meaning: "fight, conflict, battle, struggle, war" },
      { wordClass: "Q", meaning: "hostile, combative, opposed" },
      { wordClass: "V", meaning: "fight, battle, struggle, oppose, resist" },
    ],
  },
  {
    kawaba: "i",
    type: "marker",
    category: "word class prefix",
    meaning: "verb marker; used alone as the copula",
    gloss: "V",
  },
  {
    kawaba: "in",
    type: "marker",
    category: "clause marker",
    meaning: "opens a non-finite clause — a bare predication taking its subject from outside",
    gloss: "NF",
  },
  {
    kawaba: "ja",
    type: "root",
    gloss: "break",
    definitions: [
      { wordClass: "N", meaning: "breakage, damage, ruin" },
      { wordClass: "Q", meaning: "broken, damaged, ruined" },
      { wordClass: "V", meaning: "break, damage, destroy, ruin" },
    ],
  },
  {
    kawaba: "jan",
    type: "root",
    gloss: "light",
    definitions: [
      { wordClass: "N", meaning: "light, brightness, illumination, glow" },
      { wordClass: "Q", meaning: "bright, light, luminous, shining" },
      { wordClass: "V", meaning: "shine, glow, illuminate, light up" },
    ],
  },
  {
    kawaba: "je",
    type: "root",
    gloss: "feel",
    definitions: [
      { wordClass: "N", meaning: "feeling, sensation, emotion, experience, perception" },
      { wordClass: "Q", meaning: "emotional, sensory" },
      { wordClass: "V", meaning: "feel, sense, experience, perceive" },
    ],
  },
  {
    kawaba: "jemu",
    type: "compound",
    etymology: "a good feeling",
    definitions: [
      { wordClass: "interjection", meaning: "hello! (general greeting)" },
      { wordClass: "N", meaning: "happiness, contentment, love, joy" },
      { wordClass: "Q", meaning: "happy, content, joyful, glad" },
      { wordClass: "V", meaning: "be happy, enjoy, delight in" },
    ],
  },
  {
    kawaba: "jen",
    type: "root",
    gloss: "start",
    definitions: [
      { wordClass: "N", meaning: "start, beginning, onset, origin" },
      { wordClass: "Q", meaning: "initial, first, beginning, original" },
      { wordClass: "V", meaning: "start, begin, initiate" },
    ],
  },
  {
    kawaba: "ji",
    type: "root",
    gloss: "true",
    definitions: [
      { wordClass: "N", meaning: "truth, fact, reality" },
      { wordClass: "Q", meaning: "true, real, correct, genuine, accurate" },
      { wordClass: "V", meaning: "confirm, verify, affirm" },
    ],
  },
  {
    kawaba: "jin",
    type: "root",
    gloss: "choose",
    definitions: [
      { wordClass: "N", meaning: "choice, selection, option, decision" },
      { wordClass: "Q", meaning: "chosen, selected, preferred" },
      { wordClass: "V", meaning: "choose, select, pick, decide" },
    ],
  },
  {
    kawaba: "jo",
    type: "root",
    gloss: "need",
    definitions: [
      { wordClass: "N", meaning: "need, necessity, requirement" },
      { wordClass: "Q", meaning: "necessary, needed, required, essential" },
      { wordClass: "V", meaning: "need, require, must" },
    ],
  },
  {
    kawaba: "jon",
    type: "root",
    gloss: "use",
    definitions: [
      { wordClass: "N", meaning: "usage, function, purpose, application" },
      { wordClass: "Q", meaning: "useful, used, functional, in use" },
      { wordClass: "V", meaning: "use, utilise, employ, apply" },
    ],
  },
  {
    kawaba: "ju",
    type: "root",
    gloss: "want",
    definitions: [
      { wordClass: "N", meaning: "want, desire, wish, will" },
      { wordClass: "Q", meaning: "wanted, desirable" },
      { wordClass: "V", meaning: "want, desire, wish" },
    ],
  },
  {
    kawaba: "jun",
    type: "root",
    gloss: "middle",
    definitions: [
      { wordClass: "N", meaning: "middle, centre, core" },
      { wordClass: "Q", meaning: "middle, central, intermediate, medium" },
      { wordClass: "C", meaning: "between, among, amid, in the middle of" },
    ],
  },
  {
    kawaba: "ka",
    type: "root",
    gloss: "kind of",
    definitions: [
      { wordClass: "N", meaning: "kind, type, sort, category, class, variety" },
      { wordClass: "Q", meaning: "typical, characteristic, representative" },
      { wordClass: "V", meaning: "classify, categorise, sort" },
    ],
  },
  {
    kawaba: "kan",
    type: "root",
    gloss: "become",
    definitions: [
      { wordClass: "N", meaning: "change, transformation, shift" },
      { wordClass: "Q", meaning: "changed, transformed" },
      { wordClass: "V", meaning: "become, turn into, change into, come to be" },
    ],
  },
  {
    kawaba: "kawa",
    type: "compound",
    etymology: "a kind of speaking",
    definitions: [
      { wordClass: "N", meaning: "language, dialect, accent" },
      { wordClass: "Q", meaning: "linguistic, of language" },
    ],
  },
  {
    kawaba: "kawaba",
    type: "compound",
    etymology: "the language of parts, after the roots it builds every word from",
    definitions: [
      { wordClass: "N", meaning: "Kawaba, the language of parts" },
    ],
  },
  {
    kawaba: "ke",
    type: "root",
    gloss: "can",
    definitions: [
      { wordClass: "N", meaning: "ability, capability, capacity, skill" },
      { wordClass: "Q", meaning: "able, capable, possible" },
      { wordClass: "V", meaning: "can, be able to, be capable of, manage to" },
    ],
  },
  {
    kawaba: "ken",
    type: "root",
    gloss: "hot",
    definitions: [
      { wordClass: "N", meaning: "heat, warmth, temperature" },
      { wordClass: "Q", meaning: "hot, warm" },
      { wordClass: "V", meaning: "heat, warm up" },
    ],
  },
  {
    kawaba: "ki",
    type: "root",
    gloss: "know",
    definitions: [
      { wordClass: "N", meaning: "knowledge, understanding, awareness" },
      { wordClass: "Q", meaning: "known, familiar, understood" },
      { wordClass: "V", meaning: "know, understand, recognise, be aware of" },
    ],
  },
  {
    kawaba: "kin",
    type: "root",
    gloss: "difficult",
    definitions: [
      { wordClass: "N", meaning: "difficulty, hardship, challenge, complexity" },
      { wordClass: "Q", meaning: "difficult, hard, challenging, complex" },
      { wordClass: "V", meaning: "complicate, make difficult" },
    ],
  },
  {
    kawaba: "ko",
    type: "root",
    gloss: "small",
    definitions: [
      { wordClass: "N", meaning: "smallness, small size" },
      { wordClass: "Q", meaning: "small, little, tiny, slight" },
      { wordClass: "V", meaning: "shrink, reduce, diminish" },
    ],
  },
  {
    kawaba: "kon",
    type: "root",
    gloss: "soft",
    definitions: [
      { wordClass: "N", meaning: "softness, gentleness" },
      { wordClass: "Q", meaning: "soft, gentle" },
      { wordClass: "V", meaning: "soften" },
    ],
  },
  {
    kawaba: "ku",
    type: "root",
    gloss: "what",
    definitions: [
      { wordClass: "N", meaning: "what, what thing" },
      { wordClass: "Q", meaning: "which, what kind of" },
      { wordClass: "O", meaning: "how many, how much" },
    ],
  },
  {
    kawaba: "kun",
    type: "root",
    gloss: "easy",
    definitions: [
      { wordClass: "N", meaning: "ease, simplicity" },
      { wordClass: "Q", meaning: "easy, simple, straightforward" },
      { wordClass: "V", meaning: "simplify, ease, make easier" },
    ],
  },
  {
    kawaba: "la",
    type: "root",
    gloss: "person",
    definitions: [
      { wordClass: "N", meaning: "person, human, individual, being, people" },
      { wordClass: "Q", meaning: "human, personal" },
    ],
  },
  {
    kawaba: "ladu",
    type: "compound",
    etymology: "a big person",
    definitions: [
      { wordClass: "N", meaning: "adult, senior, elder" },
      { wordClass: "Q", meaning: "adult, grown, senior" },
    ],
  },
  {
    kawaba: "laki",
    type: "compound",
    etymology: "a person who knows",
    definitions: [
      { wordClass: "N", meaning: "teacher, expert, scholar, one who knows" },
    ],
  },
  {
    kawaba: "lako",
    type: "compound",
    etymology: "a small person",
    definitions: [
      { wordClass: "N", meaning: "child, youth, infant, baby, kid" },
      { wordClass: "Q", meaning: "young, childish, juvenile" },
    ],
  },
  {
    kawaba: "lan",
    type: "root",
    gloss: "health",
    definitions: [
      { wordClass: "N", meaning: "health, wellbeing, fitness" },
      { wordClass: "Q", meaning: "healthy, well, sound, fit" },
      { wordClass: "V", meaning: "heal, cure, restore, recover" },
    ],
  },
  {
    kawaba: "lawa",
    type: "compound",
    etymology: "a person who speaks",
    definitions: [
      { wordClass: "N", meaning: "speaker, lecturer, orator" },
    ],
  },
  {
    kawaba: "lawa-kawaba",
    type: "compound",
    definitions: [
      { wordClass: "N", meaning: "Kawaba speaker" },
    ],
  },
  {
    kawaba: "le",
    type: "root",
    gloss: "see",
    definitions: [
      { wordClass: "N", meaning: "sight, vision, seeing, view, look" },
      { wordClass: "Q", meaning: "visible, visual, seen" },
      { wordClass: "V", meaning: "see, look at, watch, observe" },
    ],
  },
  {
    kawaba: "len",
    type: "root",
    gloss: "air",
    definitions: [
      { wordClass: "N", meaning: "air, gas, atmosphere, breath, wind" },
      { wordClass: "Q", meaning: "airy, gaseous, airborne" },
      { wordClass: "V", meaning: "breathe, blow" },
    ],
  },
  {
    kawaba: "li",
    type: "root",
    gloss: "inside",
    definitions: [
      { wordClass: "N", meaning: "inside, interior, inner part, contents" },
      { wordClass: "Q", meaning: "inner, internal, inside, interior" },
      { wordClass: "V", meaning: "contain, hold, enclose" },
      { wordClass: "C", meaning: "inside, within, indoors" },
    ],
  },
  {
    kawaba: "lin",
    type: "root",
    gloss: "long",
    definitions: [
      { wordClass: "N", meaning: "length, extent, span, duration" },
      { wordClass: "Q", meaning: "long, lengthy, extended, tall" },
      { wordClass: "V", meaning: "lengthen, extend, stretch, prolong" },
    ],
  },
  {
    kawaba: "lo",
    type: "root",
    gloss: "live",
    definitions: [
      { wordClass: "N", meaning: "life, living, existence" },
      { wordClass: "Q", meaning: "alive, living" },
      { wordClass: "V", meaning: "live, be alive, dwell, reside" },
    ],
  },
  {
    kawaba: "lon",
    type: "root",
    gloss: "tool",
    definitions: [
      { wordClass: "N", meaning: "tool, instrument, device, implement, machine" },
      { wordClass: "Q", meaning: "mechanical, instrumental" },
    ],
  },
  {
    kawaba: "lu",
    type: "root",
    gloss: "3",
    definitions: [
      { wordClass: "N", meaning: "3rd person pronoun, she, her, he, him, it, they, them" },
      { wordClass: "Q", meaning: "her, hers, his, its, their, theirs" },
    ],
  },
  {
    kawaba: "lun",
    type: "root",
    gloss: "control",
    definitions: [
      { wordClass: "N", meaning: "control, authority, power, governance, rule" },
      { wordClass: "Q", meaning: "controlling, dominant, governing" },
      { wordClass: "V", meaning: "control, govern, rule, manage, direct" },
    ],
  },
  {
    kawaba: "ma",
    type: "root",
    gloss: "move",
    definitions: [
      { wordClass: "N", meaning: "movement, motion, travel, journey" },
      { wordClass: "Q", meaning: "moving, mobile, in motion" },
      { wordClass: "V", meaning: "move, go, travel, proceed" },
    ],
  },
  {
    kawaba: "man",
    type: "root",
    gloss: "round",
    definitions: [
      { wordClass: "N", meaning: "circle, sphere, ring, curve, ball" },
      { wordClass: "Q", meaning: "round, circular, spherical, curved" },
      { wordClass: "V", meaning: "turn, rotate, spin, circle" },
    ],
  },
  {
    kawaba: "me",
    type: "root",
    gloss: "side",
    definitions: [
      { wordClass: "N", meaning: "side, edge, flank, margin, direction" },
      { wordClass: "Q", meaning: "lateral, side, sideways" },
      { wordClass: "C", meaning: "beside, alongside, next to" },
    ],
  },
  {
    kawaba: "men",
    type: "root",
    gloss: "give",
    definitions: [
      { wordClass: "N", meaning: "gift, giving, donation, offering" },
      { wordClass: "V", meaning: "give, hand over, offer, provide, donate" },
    ],
  },
  {
    kawaba: "mi",
    type: "root",
    gloss: "1",
    definitions: [
      { wordClass: "N", meaning: "1st person pronoun, I, me, us, we" },
      { wordClass: "Q", meaning: "my, mine, our, ours" },
    ],
  },
  {
    kawaba: "min",
    type: "root",
    gloss: "house",
    definitions: [
      { wordClass: "N", meaning: "house, home, building, dwelling, room" },
      { wordClass: "V", meaning: "house, shelter, accommodate" },
      { wordClass: "C", meaning: "at home, indoors, in the house" },
    ],
  },
  {
    kawaba: "mo",
    type: "root",
    gloss: "far",
    definitions: [
      { wordClass: "N", meaning: "distance, remoteness, the distance" },
      { wordClass: "Q", meaning: "far, distant, remote, faraway" },
      { wordClass: "C", meaning: "far away, in the distance, afar" },
    ],
  },
  {
    kawaba: "mon",
    type: "root",
    gloss: "dirty",
    definitions: [
      { wordClass: "N", meaning: "dirt, filth, impurity, waste" },
      { wordClass: "Q", meaning: "dirty, filthy, impure, unclean" },
      { wordClass: "V", meaning: "dirty, soil, contaminate, pollute" },
    ],
  },
  {
    kawaba: "mu",
    type: "root",
    gloss: "good",
    definitions: [
      { wordClass: "N", meaning: "good, goodness, benefit, virtue" },
      { wordClass: "Q", meaning: "good, pleasant, positive, beneficial" },
      { wordClass: "V", meaning: "improve, better, benefit" },
    ],
  },
  {
    kawaba: "mun",
    type: "root",
    gloss: "love",
    definitions: [
      { wordClass: "N", meaning: "love, affection, care, devotion" },
      { wordClass: "Q", meaning: "beloved, loving, dear, cherished" },
      { wordClass: "V", meaning: "love, cherish, care for, be devoted to" },
    ],
  },
  {
    kawaba: "na",
    type: "marker",
    category: "preposition",
    meaning: "of, belonging to, associated with (genitive)",
    gloss: "GEN",
  },
  {
    kawaba: "nan",
    type: "marker",
    category: "conjunction",
    meaning: "because, since, for",
    gloss: "because",
  },
  {
    kawaba: "ne",
    type: "marker",
    category: "preposition",
    meaning: "to, for (recipient, beneficiary)",
    gloss: "REC",
  },
  {
    kawaba: "nen",
    type: "marker",
    category: "conjunction",
    meaning: "and",
    gloss: "and",
  },
  {
    kawaba: "ni",
    type: "marker",
    category: "preposition",
    meaning: "with, by means of, using (instrument, means)",
    gloss: "INS",
  },
  {
    kawaba: "nin",
    type: "marker",
    category: "conjunction",
    meaning: "if, in the event that",
    gloss: "if",
  },
  {
    kawaba: "no",
    type: "marker",
    category: "preposition",
    meaning: "about, regarding (topic, subject)",
    gloss: "ABT",
  },
  {
    kawaba: "non",
    type: "marker",
    category: "conjunction",
    meaning: "or",
    gloss: "or",
  },
  {
    kawaba: "nu",
    type: "marker",
    category: "preposition",
    meaning: "with, together with, accompanied by (comitative)",
    gloss: "COM",
  },
  {
    kawaba: "nun",
    type: "marker",
    category: "conjunction",
    meaning: "but, yet, however",
    gloss: "but",
  },
  {
    kawaba: "o",
    type: "marker",
    category: "word class prefix",
    meaning: "operator marker",
    gloss: "OP",
  },
  {
    kawaba: "on",
    type: "marker",
    category: "clause marker",
    meaning: "opens a degree clause, marking the standard of a comparison",
    gloss: "DEG",
  },
  {
    kawaba: "pa",
    type: "root",
    gloss: "think",
    definitions: [
      { wordClass: "N", meaning: "thought, idea, mind" },
      { wordClass: "Q", meaning: "mental, thoughtful, cognitive" },
      { wordClass: "V", meaning: "think, consider, reflect, ponder" },
    ],
  },
  {
    kawaba: "pan",
    type: "root",
    gloss: "sleep",
    definitions: [
      { wordClass: "N", meaning: "sleep, rest, slumber" },
      { wordClass: "Q", meaning: "asleep, sleeping, dormant" },
      { wordClass: "V", meaning: "sleep, rest, fall asleep" },
    ],
  },
  {
    kawaba: "pe",
    type: "root",
    gloss: "try",
    definitions: [
      { wordClass: "N", meaning: "attempt, effort, trial, test" },
      { wordClass: "Q", meaning: "attempted, experimental" },
      { wordClass: "V", meaning: "try, attempt, test" },
    ],
  },
  {
    kawaba: "pen",
    type: "root",
    gloss: "join",
    definitions: [
      { wordClass: "N", meaning: "one, connection, link, junction, joint" },
      { wordClass: "Q", meaning: "singular, connected, joined, attached, linked" },
      { wordClass: "V", meaning: "unify, connect, join, attach, link, combine" },
      { wordClass: "O", meaning: "one" },
    ],
  },
  {
    kawaba: "pi",
    type: "root",
    gloss: "more",
    definitions: [
      { wordClass: "N", meaning: "increase, addition, surplus, excess" },
      { wordClass: "Q", meaning: "additional, extra, further" },
      { wordClass: "V", meaning: "increase, add, raise" },
      { wordClass: "O", meaning: "more, greater, -er" },
    ],
  },
  {
    kawaba: "pin",
    type: "root",
    gloss: "sound",
    definitions: [
      { wordClass: "N", meaning: "sound, noise, tone" },
      { wordClass: "Q", meaning: "audible, sonic" },
      { wordClass: "V", meaning: "make a sound, ring" },
    ],
  },
  {
    kawaba: "po",
    type: "root",
    gloss: "after",
    definitions: [
      { wordClass: "N", meaning: "future, back" },
      { wordClass: "Q", meaning: "next, subsequent, later, following" },
      { wordClass: "V", meaning: "follow, come after, succeed" },
      { wordClass: "C", meaning: "after, afterwards, later, then" },
    ],
  },
  {
    kawaba: "pon",
    type: "root",
    gloss: "new",
    definitions: [
      { wordClass: "N", meaning: "novelty, newness" },
      { wordClass: "Q", meaning: "new, fresh, recent, novel" },
      { wordClass: "V", meaning: "renew, refresh, update" },
    ],
  },
  {
    kawaba: "pu",
    type: "root",
    gloss: "bad",
    definitions: [
      { wordClass: "N", meaning: "bad, badness, evil, wrong" },
      { wordClass: "Q", meaning: "bad, unpleasant, negative, detrimental" },
      { wordClass: "V", meaning: "worsen, spoil, degrade" },
    ],
  },
  {
    kawaba: "pun",
    type: "root",
    gloss: "animal",
    definitions: [
      { wordClass: "N", meaning: "animal, creature, beast" },
      { wordClass: "Q", meaning: "animal, bestial" },
    ],
  },
  {
    kawaba: "punga",
    type: "compound",
    etymology: "dogs are close to humans as the first domesticated animal",
    definitions: [
      { wordClass: "N", meaning: "dog, canine" },
    ],
  },
  {
    kawaba: "sa",
    type: "root",
    gloss: "many",
    definitions: [
      { wordClass: "N", meaning: "abundance, multitude, great quantity" },
      { wordClass: "Q", meaning: "numerous, abundant, plentiful" },
      { wordClass: "O", meaning: "many, much, a lot of, very" },
    ],
  },
  {
    kawaba: "san",
    type: "root",
    gloss: "fast",
    definitions: [
      { wordClass: "N", meaning: "speed, quickness, rate, pace" },
      { wordClass: "Q", meaning: "fast, quick, rapid, swift" },
      { wordClass: "V", meaning: "hurry, hasten, speed up" },
    ],
  },
  {
    kawaba: "se",
    type: "root",
    gloss: "same",
    definitions: [
      { wordClass: "N", meaning: "identity, equality, likeness" },
      { wordClass: "Q", meaning: "similar, identical, equal, alike" },
      { wordClass: "V", meaning: "match, equal, be the same as" },
      { wordClass: "O", meaning: "same, self" },
      { wordClass: "C", meaning: "similarly, likewise" },
    ],
  },
  {
    kawaba: "sen",
    type: "root",
    gloss: "hurt",
    definitions: [
      { wordClass: "interjection", meaning: "ouch! (reaction to pain)" },
      { wordClass: "N", meaning: "pain, wound, injury, harm" },
      { wordClass: "Q", meaning: "painful, wounded, hurt, injured" },
      { wordClass: "V", meaning: "hurt, harm, wound, injure, attack" },
    ],
  },
  {
    kawaba: "si",
    type: "root",
    gloss: "this",
    definitions: [
      { wordClass: "N", meaning: "this one, that one" },
      { wordClass: "O", meaning: "this, that, these, those" },
    ],
  },
  {
    kawaba: "sin",
    type: "root",
    gloss: "colour",
    definitions: [
      { wordClass: "N", meaning: "colour, hue, shade, tint" },
      { wordClass: "Q", meaning: "coloured, colourful" },
      { wordClass: "V", meaning: "colour, dye, paint, tint" },
    ],
  },
  {
    kawaba: "so",
    type: "root",
    gloss: "time",
    definitions: [
      { wordClass: "N", meaning: "time, period, duration, occasion" },
      { wordClass: "Q", meaning: "temporal, timed" },
      { wordClass: "C", meaning: "at a time, at the time" },
    ],
  },
  {
    kawaba: "sodu",
    type: "compound",
    etymology: "a big time",
    definitions: [
      { wordClass: "N", meaning: "age, era, epoch" },
      { wordClass: "Q", meaning: "old, aged, ancient" },
    ],
  },
  {
    kawaba: "soko",
    type: "compound",
    etymology: "a small time",
    definitions: [
      { wordClass: "N", meaning: "moment, instant" },
      { wordClass: "Q", meaning: "brief, shortly" },
    ],
  },
  {
    kawaba: "son",
    type: "root",
    gloss: "shape",
    definitions: [
      { wordClass: "N", meaning: "shape, form, figure, outline" },
      { wordClass: "Q", meaning: "shaped, formed" },
      { wordClass: "V", meaning: "shape, form, mould" },
    ],
  },
  {
    kawaba: "su",
    type: "root",
    gloss: "word",
    definitions: [
      { wordClass: "N", meaning: "word, term, name, expression" },
      { wordClass: "V", meaning: "name, call, term" },
    ],
  },
  {
    kawaba: "sun",
    type: "root",
    gloss: "play",
    definitions: [
      { wordClass: "N", meaning: "play, game, fun, recreation" },
      { wordClass: "Q", meaning: "playful, fun, recreational" },
      { wordClass: "V", meaning: "play, have fun" },
    ],
  },
  {
    kawaba: "ta",
    type: "root",
    gloss: "place",
    definitions: [
      { wordClass: "N", meaning: "place, location, position, area, site" },
      { wordClass: "V", meaning: "place, put, set, locate" },
    ],
  },
  {
    kawaba: "tan",
    type: "root",
    gloss: "number",
    definitions: [
      { wordClass: "N", meaning: "number, count, figure, quantity" },
      { wordClass: "Q", meaning: "numerical, numeric" },
      { wordClass: "V", meaning: "count, number, enumerate" },
    ],
  },
  {
    kawaba: "te",
    type: "root",
    gloss: "not",
    definitions: [
      { wordClass: "N", meaning: "negation, absence, nothing, lack" },
      { wordClass: "Q", meaning: "absent, nonexistent, lacking" },
      { wordClass: "V", meaning: "lack, be without, deny" },
      { wordClass: "O", meaning: "not, no, non-" },
    ],
  },
  {
    kawaba: "ten",
    type: "root",
    gloss: "divide",
    definitions: [
      { wordClass: "N", meaning: "two, division, separation" },
      { wordClass: "Q", meaning: "dual, separated, divided, split" },
      { wordClass: "V", meaning: "divide, split, separate, halve" },
      { wordClass: "O", meaning: "two of" },
    ],
  },
  {
    kawaba: "ti",
    type: "root",
    gloss: "few",
    definitions: [
      { wordClass: "N", meaning: "scarcity, shortage" },
      { wordClass: "Q", meaning: "scarce, sparse, rare" },
      { wordClass: "O", meaning: "few, little" },
    ],
  },
  {
    kawaba: "tin",
    type: "root",
    gloss: "sex",
    definitions: [
      { wordClass: "N", meaning: "sex, sexuality" },
      { wordClass: "Q", meaning: "sexual" },
      { wordClass: "V", meaning: "have sex, copulate, mate" },
    ],
  },
  {
    kawaba: "to",
    type: "root",
    gloss: "2",
    definitions: [
      { wordClass: "N", meaning: "2nd person pronoun, you" },
      { wordClass: "Q", meaning: "your, yours" },
    ],
  },
  {
    kawaba: "ton",
    type: "root",
    gloss: "line",
    definitions: [
      { wordClass: "N", meaning: "line, row, stripe, sequence, edge" },
      { wordClass: "Q", meaning: "linear, straight, lined" },
      { wordClass: "V", meaning: "line up, align, arrange in a line" },
    ],
  },
  {
    kawaba: "tu",
    type: "root",
    gloss: "do",
    definitions: [
      { wordClass: "N", meaning: "action, act, deed, activity" },
      { wordClass: "Q", meaning: "active, done" },
      { wordClass: "V", meaning: "do, act, perform, carry out" },
    ],
  },
  {
    kawaba: "tun",
    type: "root",
    gloss: "plant",
    definitions: [
      { wordClass: "N", meaning: "plant, vegetation, flora, tree" },
      { wordClass: "Q", meaning: "plant, vegetal" },
      { wordClass: "V", meaning: "plant, sow, cultivate" },
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
    kawaba: "un",
    type: "marker",
    category: "clause marker",
    meaning: "opens an adverbial clause — a clause used to situate the event in time, place or circumstance",
    gloss: "ADV",
  },
  {
    kawaba: "wa",
    type: "root",
    gloss: "speak",
    definitions: [
      { wordClass: "N", meaning: "speech, speaking, communication" },
      { wordClass: "Q", meaning: "spoken, verbal, oral" },
      { wordClass: "V", meaning: "speak, talk, say, tell, communicate" },
    ],
  },
  {
    kawaba: "wan",
    type: "root",
    gloss: "trade",
    definitions: [
      { wordClass: "N", meaning: "trade, exchange, commerce, transaction" },
      { wordClass: "V", meaning: "trade, exchange, buy, sell, barter" },
    ],
  },
  {
    kawaba: "we",
    type: "root",
    gloss: "other",
    definitions: [
      { wordClass: "N", meaning: "the other, another one, difference" },
      { wordClass: "Q", meaning: "different, distinct, unlike" },
      { wordClass: "V", meaning: "differ, differ from" },
      { wordClass: "O", meaning: "other, another, else" },
    ],
  },
  {
    kawaba: "wen",
    type: "root",
    gloss: "important",
    definitions: [
      { wordClass: "N", meaning: "importance, significance, weight, value" },
      { wordClass: "Q", meaning: "important, significant, major, serious" },
      { wordClass: "V", meaning: "matter, be important" },
    ],
  },
  {
    kawaba: "wi",
    type: "root",
    gloss: "some",
    definitions: [
      { wordClass: "N", meaning: "amount, quantity, portion" },
      { wordClass: "O", meaning: "some, any, a certain" },
    ],
  },
  {
    kawaba: "win",
    type: "root",
    gloss: "cold",
    definitions: [
      { wordClass: "N", meaning: "cold, coldness, chill" },
      { wordClass: "Q", meaning: "cold, cool, chilly" },
      { wordClass: "V", meaning: "cool, chill, cool down" },
    ],
  },
  {
    kawaba: "wo",
    type: "root",
    gloss: "touch",
    definitions: [
      { wordClass: "N", meaning: "touch, contact" },
      { wordClass: "Q", meaning: "tactile, in contact, touching" },
      { wordClass: "V", meaning: "touch, contact, make contact with" },
    ],
  },
  {
    kawaba: "won",
    type: "root",
    gloss: "sharp",
    definitions: [
      { wordClass: "N", meaning: "point, edge, blade, sharpness" },
      { wordClass: "Q", meaning: "sharp, pointed, keen, acute" },
      { wordClass: "V", meaning: "cut, sharpen, pierce" },
    ],
  },
  {
    kawaba: "wu",
    type: "root",
    gloss: "like",
    definitions: [
      { wordClass: "N", meaning: "likeness, similarity, resemblance" },
      { wordClass: "Q", meaning: "similar, alike, resembling" },
      { wordClass: "V", meaning: "resemble, be like, be similar to" },
      { wordClass: "C", meaning: "like, as, in the manner of" },
    ],
  },
  {
    kawaba: "wun",
    type: "root",
    gloss: "male",
    definitions: [
      { wordClass: "N", meaning: "male, man" },
      { wordClass: "Q", meaning: "male, masculine" },
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

// A morpheme's gloss, falling back to its bare spelling when it isn't in the
// dictionary yet. Multi-word glosses (e.g. "kind of") are period-joined so
// they read as a single gloss unit rather than being mistaken for a word break.
function glossMorpheme(token: string): string {
  const gloss = morphemeGlosses[token];
  return gloss ? gloss.replace(/\s+/g, ".") : token;
}

function glossWord(word: string): string {
  let gloss = "";
  for (const token of splitMorphemes(word)) {
    if (token === "-") {
      // A hyphen in the word marks a compound-of-compound boundary, so it
      // gets its own "+" in the gloss rather than the usual "-".
      gloss += "+";
    } else if (!/[a-z]/i.test(token)) {
      // Punctuation (e.g. the "!" on an interjection, or the brackets around a
      // compound) attaches directly rather than being treated as a morpheme.
      gloss += token;
    } else {
      // Morphemes are hyphen-joined, but only to each other — no separator
      // after an opening bracket or a "+" that already joins them.
      if (/[\w.]$/.test(gloss)) gloss += "-";
      gloss += glossMorpheme(token);
    }
  }
  return gloss;
}

// Generates an interlinear gloss line for a Kawaba example straight from the
// dictionary, so it doesn't need to be typed out by hand. Words are
// space-separated, and each word's morphemes are hyphen-joined, matching the
// existing hand-written gloss convention.
export function generateGloss(kawaba: string): string {
  return kawaba
    .split(/\s+/)
    .filter(Boolean)
    .map(glossWord)
    .join(" ");
}