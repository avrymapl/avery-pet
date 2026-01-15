'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState, Suspense } from 'react';

// Dictionary data structure
const dictionaryData = [
  { root: 'ba', isRoot: true, definitions: [{ pos: 'noun', meaning: 'part, piece, portion, fraction, section, component, segment, division' }] },
  { root: 'ban', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'most (superlative)' }] },
  { root: 'be', isRoot: true, definitions: [{ pos: 'noun', meaning: 'cause, reason, source, origin, motivation' }, { pos: 'verb', meaning: 'to cause, to make happen, to bring about, to create, to generate' }] },
  { root: 'ben', isRoot: true, definitions: [{ pos: 'verb', meaning: 'get, acquire, receive' }] },
  { root: 'bi', isRoot: true, definitions: [{ pos: 'noun', meaning: 'possessions, belongings, property, assets'}, { pos: 'verb', meaning: 'to have, to own, to hold, to possess, to contain' }] },
  { root: 'bin', isRoot: true, definitions: [{ pos: 'noun', meaning: 'hole, opening, gap' }] },
  { root: 'bo', isRoot: true, definitions: [{ pos: 'noun', meaning: 'past, history, front, anterior' }, { pos: 'modifier', meaning: 'before, in front, ahead, previous, earlier, prior' }, { pos: 'preposition', meaning: 'before, in front of' }] },
  { root: 'bon', isRoot: true, definitions: [{ pos: 'noun', meaning: 'cloth, fabric, textile' }] },
  { root: 'bu', isRoot: true, definitions: [{ pos: 'noun', meaning: 'construction, creation, building, fabrication, production' }, { pos: 'verb', meaning: 'to make, to build, to create, to construct, to fabricate, to produce, to craft' }] },
  { root: 'bun', isRoot: true, definitions: [{ pos: 'noun', meaning: 'surface, exterior, face' }] },
  { root: 'da', isRoot: true, definitions: [{ pos: 'noun', meaning: 'thing, matter, material, substance, object, entity, item, stuff' }, { pos: 'modifier', meaning: 'physical, material, tangible, concrete' }] },
  { root: 'dan', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to stop, to halt, to cease' }] },
  { root: 'de', isRoot: true, definitions: [{ pos: 'noun', meaning: 'body, form, shape, figure, physique, structure' }] },
  { root: 'den', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to write, to inscribe, to record' }] },
  { root: 'di', isRoot: true, definitions: [{ pos: 'noun', meaning: 'death, demise, mortality, end' }, { pos: 'verb', meaning: 'to die, to perish, to expire, to pass away' }, { pos: 'modifier', meaning: 'dead, lifeless' }] },
  { root: 'din', isRoot: true, definitions: [{ pos: 'noun', meaning: 'stone, rock' }] },
  { root: 'do', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to come, to arrive, to approach, to get to' }] },
  { root: 'don', isRoot: true, definitions: [{ pos: 'noun', meaning: 'female, woman' }, { pos: 'modifier', meaning: 'feminine' }] },
  { root: 'du', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'big, large, great, huge, massive, enormous, significant' }, { pos: 'noun', meaning: 'size, largeness, magnitude' }] },
  { root: 'dun', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to stay, to remain' }] },
  { root: 'ga', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'near, close, nearby, proximate, adjacent' }, { pos: 'preposition', meaning: 'near, close to' }, { pos: 'noun', meaning: 'proximity, nearness' }] },
  { root: 'gan', isRoot: true, definitions: [{ pos: 'noun', meaning: 'group, collection, set' }] },
  { root: 'ge', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'above, up, high, top, upper, over, superior' }, { pos: 'preposition', meaning: 'above, over' }, { pos: 'noun', meaning: 'top, height, sky' }] },
  { root: 'gen', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'strong, powerful' }] },
  { root: 'gi', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'auditory, aural, sonic, acoustic' }, { pos: 'verb', meaning: 'to hear, to listen, to perceive sound' }, { pos: 'noun', meaning: 'hearing, auditory sense' }] },
  { root: 'gin', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to eat, to consume' }] },
  { root: 'go', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'below, down, under, lower, beneath' }, { pos: 'preposition', meaning: 'below, under, beneath' }, { pos: 'noun', meaning: 'bottom, ground, base' }] },
  { root: 'gon', isRoot: true, definitions: [{ pos: 'noun', meaning: 'water, liquid' }] },
  { root: 'gu', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'all, every, whole, entire, total, complete' }, { pos: 'noun', meaning: 'everything, totality, entirety' }] },
  { root: 'gun', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to fight, to battle, to struggle' }] },
  { root: 'ja', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to break, to shatter, to fracture, to split, to destroy' }, { pos: 'noun', meaning: 'break, fracture, damage' }] },
  { root: 'jan', isRoot: true, definitions: [{ pos: 'noun', meaning: 'light, illumination' }] },
  { root: 'je', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to feel, to sense, to experience, to perceive emotionally' }, { pos: 'noun', meaning: 'feeling, emotion, sensation, sense' }] },
  { root: 'jen', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to start, to begin, to initiate' }] },
  { root: 'jemu', isRoot: false, definitions: [{ pos: 'interjection', meaning: 'hello, greetings' }, { pos: 'noun', meaning: 'good feelings, happiness' }, { pos: 'modifier', meaning: 'happy' }, { pos: 'verb', meaning: 'to feel good, to be happy' }] },
  { root: 'ji', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'true, real, genuine, authentic, actual, correct' }, { pos: 'noun', meaning: 'truth, reality, fact' }] },
  { root: 'jin', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to choose, to select, to pick' }] },
  { root: 'jo', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to need, to require, to necessitate' }, { pos: 'noun', meaning: 'need, necessity, requirement' }] },
  { root: 'jon', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to use, to utilize, to employ' }] },
  { root: 'ju', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to want, to desire, to wish for, to crave' }, { pos: 'noun', meaning: 'want, desire, wish' }] },
  { root: 'jun', isRoot: true, definitions: [{ pos: 'noun', meaning: 'middle, center' }] },
  { root: 'ka', isRoot: true, definitions: [{ pos: 'noun', meaning: 'kind, type, sort, category, class, variety' }] },
  { root: 'kan', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to become, to turn into' }] },
  { root: 'kawa', isRoot: false, definitions: [{ pos: 'noun', meaning: 'language, dialect, accent' }] },
  { root: 'ke', isRoot: true, definitions: [{ pos: 'verb', meaning: 'can, to be able to, to have ability' }, { pos: 'modifier', meaning: 'able, capable, possible' }, { pos: 'noun', meaning: 'ability, capability, capacity' }] },
  { root: 'ken', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'hot, warm' }] },
  { root: 'ki', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to know, to understand, to be aware of, to recognize' }, { pos: 'noun', meaning: 'knowledge, understanding, awareness' }] },
  { root: 'kin', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'difficult, hard, challenging' }] },
  { root: 'ko', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'small, little, tiny, minor, petite' }, { pos: 'noun', meaning: 'smallness, littleness' }] },
  { root: 'kon', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'soft, gentle' }] },
  { root: 'ku', isRoot: true, definitions: [{ pos: 'noun', meaning: 'what, which, something' }, { pos: 'modifier', meaning: 'what kind of, which' }] },
  { root: 'kun', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'easy, simple' }] },
  { root: 'la', isRoot: true, definitions: [{ pos: 'noun', meaning: 'person, human, individual, being, people' }] },
  { root: 'lan', isRoot: true, definitions: [{ pos: 'noun', meaning: 'health, wellness' }] },
  { root: 'le', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to see, to look at, to watch, to view, to observe' }, { pos: 'noun', meaning: 'sight, vision, view' }] },
  { root: 'len', isRoot: true, definitions: [{ pos: 'noun', meaning: 'air, gas, breath' }] },
  { root: 'li', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'inside, inner, internal, interior, within' }, { pos: 'preposition', meaning: 'inside, in, within' }, { pos: 'noun', meaning: 'interior, inside' }] },
  { root: 'lin', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'long, extended' }] },
  { root: 'lo', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to live, to exist, to dwell, to reside, to be alive' }, { pos: 'noun', meaning: 'life, existence, living' }] },
  { root: 'lon', isRoot: true, definitions: [{ pos: 'noun', meaning: 'tool, instrument, implement' }] },
  { root: 'lu', isRoot: true, definitions: [{ pos: 'noun', meaning: '3rd-person, they, them, he, she, it' }] },
  { root: 'lun', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to control, to manage, to direct' }] },
  { root: 'ma', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to move, to shift, to go, to travel, to relocate' }, { pos: 'noun', meaning: 'movement, motion, shift' }] },
  { root: 'man', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'round, circular' }] },
  { root: 'me', isRoot: true, definitions: [{ pos: 'noun', meaning: 'side, edge, flank, lateral part' }] },
  { root: 'men', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to give, to provide, to offer' }] },
  { root: 'mi', isRoot: true, definitions: [{ pos: 'noun', meaning: '1st-person, I, me, we, us' }] },
  { root: 'min', isRoot: true, definitions: [{ pos: 'noun', meaning: 'house, dwelling, home' }] },
  { root: 'mo', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'far, distant, remote, away' }, { pos: 'noun', meaning: 'distance, remoteness' }] },
  { root: 'mon', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'dirty, unclean, filthy' }] },
  { root: 'mu', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'good, well, fine, positive, beneficial' }, { pos: 'noun', meaning: 'goodness, quality, benefit' }] },
  { root: 'mun', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to love, to care for' }] },
  { root: 'pa', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to think, to ponder, to consider, to reflect, to contemplate' }, { pos: 'noun', meaning: 'thought, thinking, idea, consideration' }] },
  { root: 'pan', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to sleep, to rest' }] },
  { root: 'pe', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to try, to attempt, to endeavor, to make an effort' }, { pos: 'noun', meaning: 'try, attempt, effort' }] },
  { root: 'pen', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to join, to connect, to unite' }] },
  { root: 'pi', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'more, additional, further, extra, greater' }] },
  { root: 'pin', isRoot: true, definitions: [{ pos: 'noun', meaning: 'sound, noise, audio' }] },
  { root: 'po', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'after, following, later, subsequent, behind' }, { pos: 'preposition', meaning: 'after, following' }, { pos: 'noun', meaning: 'future, aftermath' }] },
  { root: 'pon', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'new, fresh, recent' }] },
  { root: 'pu', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'bad, poor, wrong, negative, harmful' }, { pos: 'noun', meaning: 'badness, harm, evil' }] },
  { root: 'pun', isRoot: true, definitions: [{ pos: 'noun', meaning: 'animal, creature, beast' }] },
  { root: 'sa', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'many, numerous, multiple, several, abundant' }, { pos: 'noun', meaning: 'multitude, plurality, abundance' }] },
  { root: 'san', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'fast, quick, rapid' }] },
  { root: 'se', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'same, identical, equal, similar, alike' }, { pos: 'noun', meaning: 'sameness, similarity, equality' }] },
  { root: 'sen', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to harm, to hurt, to damage' }] },
  { root: 'si', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'this, these, current, present' }, { pos: 'noun', meaning: 'this thing, this one' }] },
  { root: 'sin', isRoot: true, definitions: [{ pos: 'noun', meaning: 'colour, hue, shade' }] },
  { root: 'so', isRoot: true, definitions: [{ pos: 'noun', meaning: 'time, moment, period, duration, era' }] },
  { root: 'son', isRoot: true, definitions: [{ pos: 'noun', meaning: 'shape, form, figure' }] },
  { root: 'su', isRoot: true, definitions: [{ pos: 'noun', meaning: 'word, term, expression, utterance, speech' }] },
  { root: 'sun', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to play, to have fun' }] },
  { root: 'ta', isRoot: true, definitions: [{ pos: 'noun', meaning: 'place, location, position, spot, area, site' }] },
  { root: 'te', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'not, no, non-, un-, without, lacking' }, { pos: 'noun', meaning: 'negation, absence, lack' }] },
  { root: 'ti', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'few, little, scarce, rare, minimal' }, { pos: 'noun', meaning: 'fewness, scarcity, paucity' }] },
  { root: 'to', isRoot: true, definitions: [{ pos: 'noun', meaning: '2nd-person, you, your' }] },
  { root: 'tu', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to do, to act, to perform, to execute, to carry out' }, { pos: 'noun', meaning: 'action, deed, doing, activity' }] },
  { root: 'an', isRoot: true, definitions: [{ pos: 'preposition', meaning: 'accusative case marker (marks direct object)' }] },
  { root: 'en', isRoot: true, definitions: [{ pos: 'preposition', meaning: 'locative case marker (marks location)' }] },
  { root: 'in', isRoot: true, definitions: [{ pos: 'preposition', meaning: 'temporal case marker (marks time)' }] },
  { root: 'on', isRoot: true, definitions: [{ pos: 'preposition', meaning: 'dative case marker (marks indirect object)' }] },
  { root: 'un', isRoot: true, definitions: [{ pos: 'preposition', meaning: 'instrumental case marker (marks instrument/means)' }] },
  { root: 'nan', isRoot: true, definitions: [{ pos: 'conjunction', meaning: 'because, since, as' }] },
  { root: 'nen', isRoot: true, definitions: [{ pos: 'conjunction', meaning: 'and' }] },
  { root: 'nin', isRoot: true, definitions: [{ pos: 'conjunction', meaning: 'or' }] },
  { root: 'non', isRoot: true, definitions: [{ pos: 'conjunction', meaning: 'but, however' }] },
  { root: 'nun', isRoot: true, definitions: [{ pos: 'conjunction', meaning: 'if, whether' }] },
  { root: 'wa', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to speak, to talk, to say, to tell, to communicate' }, { pos: 'noun', meaning: 'speech, speaking, communication' }] },
  { root: 'we', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'other, different, another, else, alternative' }, { pos: 'noun', meaning: 'otherness, difference' }] },
  { root: 'wi', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'some, certain, particular, a few' }, { pos: 'noun', meaning: 'something, some amount' }] },
  { root: 'wo', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to touch, to feel, to contact, to handle' }, { pos: 'noun', meaning: 'touch, contact, feel' }] },
  { root: 'wu', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to like, to enjoy, to appreciate, to favor, to prefer' }, { pos: 'noun', meaning: 'liking, preference, fondness' }] },
];

function DictionaryContent() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const [showRootsOnly, setShowRootsOnly] = useState(false);

  // Filter dictionary data based on search term and root filter
  const filteredData = useMemo(() => {
    let data = dictionaryData;

    // Filter by root status if toggle is enabled
    if (showRootsOnly) {
      data = data.filter((entry) => entry.isRoot);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter((entry) => {
        return (
          entry.root.includes(term) ||
          entry.definitions.some((def) => def.meaning.toLowerCase().includes(term))
        );
      });
    }

    return data;
  }, [searchTerm, showRootsOnly]);

  return (
    <div className="dictionary-page">
      {/* Root words toggle */}
      <div className="box">
        <label className="toggle-container">
          <span className="toggle-label">show roots only</span>
          <button
            className={`toggle-slider ${showRootsOnly ? 'active' : ''}`}
            onClick={() => setShowRootsOnly(!showRootsOnly)}
            role="switch"
            aria-checked={showRootsOnly}
            aria-label="Toggle root words filter"
          >
            <span className="toggle-thumb" />
          </button>
        </label>
      </div>

      {searchTerm && (
        <div className="box" style={{ marginBottom: 'var(--gap-md)' }}>
          <p style={{ color: 'var(--text-heading)', fontWeight: '500', margin: 0 }}>
            {filteredData.length} {filteredData.length === 1 ? 'result' : 'results'} for &quot;{searchTerm}&quot;
          </p>
        </div>
      )}

      <div className="feed">
        {filteredData.map((entry) => (
          <div key={entry.root} className="post box">
            <h2 style={{ margin: 0 }}>{entry.root}</h2>
            <div className="post-content">
              {entry.definitions.map((def, idx) => (
                <p key={idx}>
                  <span className="pos-label">{def.pos}</span>
                  {def.meaning}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DictionaryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DictionaryContent />
    </Suspense>
  );
}
