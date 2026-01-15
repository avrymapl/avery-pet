'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState, Suspense } from 'react';

// Dictionary data structure
const dictionaryData = [
  { root: 'ba', isRoot: true, definitions: [{ pos: 'noun', meaning: 'part, piece, portion, fraction, section' }] },
  { root: 'ban', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'most (superlative)' }] },
  { root: 'be', isRoot: true, definitions: [{ pos: 'noun', meaning: 'cause, reason' }, { pos: 'verb', meaning: 'to cause, to make happen' }] },
  { root: 'ben', isRoot: true, definitions: [{ pos: 'verb', meaning: 'get, acquire, receive' }] },
  { root: 'bi', isRoot: true, definitions: [{ pos: 'noun', meaning: 'possessions, belongings'}, { pos: 'verb', meaning: 'to have, to own, to hold' }] },
  { root: 'bin', isRoot: true, definitions: [{ pos: 'noun', meaning: 'hole, opening, gap' }] },
  { root: 'bo', isRoot: true, definitions: [{ pos: 'noun', meaning: 'past, front' }, { pos: 'modifier', meaning: 'before, in front' }] },
  { root: 'bon', isRoot: true, definitions: [{ pos: 'noun', meaning: 'cloth, fabric, textile' }] },
  { root: 'bu', isRoot: true, definitions: [{ pos: 'noun', meaning: 'construction' }, { pos: 'verb', meaning: 'to make' }] },
  { root: 'bun', isRoot: true, definitions: [{ pos: 'noun', meaning: 'surface, exterior, face' }] },
  { root: 'da', isRoot: true, definitions: [{ pos: 'noun', meaning: 'thing, matter, material, substance' }, { pos: 'modifier', meaning: 'physical, material' }] },
  { root: 'dan', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to stop, to halt, to cease' }] },
  { root: 'de', isRoot: true, definitions: [{ pos: 'noun', meaning: 'body, form' }] },
  { root: 'den', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to write, to inscribe, to record' }] },
  { root: 'di', isRoot: true, definitions: [{ pos: 'noun', meaning: 'death' }, { pos: 'verb', meaning: 'to die' }] },
  { root: 'din', isRoot: true, definitions: [{ pos: 'noun', meaning: 'stone, rock' }] },
  { root: 'do', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to come' }] },
  { root: 'don', isRoot: true, definitions: [{ pos: 'noun', meaning: 'female, woman' }, { pos: 'modifier', meaning: 'feminine' }] },
  { root: 'du', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'big, large' }] },
  { root: 'dun', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to stay, to remain' }] },
  { root: 'ga', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'near, close' }] },
  { root: 'gan', isRoot: true, definitions: [{ pos: 'noun', meaning: 'group, collection, set' }] },
  { root: 'ge', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'above, up, high, top' }] },
  { root: 'gen', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'strong, powerful' }] },
  { root: 'gi', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'auditory' }, { pos: 'verb', meaning: 'to hear, to listen' }] },
  { root: 'gin', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to eat, to consume' }] },
  { root: 'go', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'below' }] },
  { root: 'gon', isRoot: true, definitions: [{ pos: 'noun', meaning: 'water, liquid' }] },
  { root: 'gu', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'all' }] },
  { root: 'gun', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to fight, to battle, to struggle' }] },
  { root: 'ja', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to break' }] },
  { root: 'jan', isRoot: true, definitions: [{ pos: 'noun', meaning: 'light, illumination' }] },
  { root: 'je', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to feel' }] },
  { root: 'jen', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to start, to begin, to initiate' }] },
  { root: 'jemu', isRoot: false, definitions: [{ pos: 'interjection', meaning: 'hello, greetings' }, { pos: 'noun', meaning: 'good feelings, happiness' }, { pos: 'modifier', meaning: 'happy' }, { pos: 'verb', meaning: 'to feel good, to be happy' }] },
  { root: 'ji', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'true' }] },
  { root: 'jin', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to choose, to select, to pick' }] },
  { root: 'jo', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to need' }] },
  { root: 'jon', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to use, to utilize, to employ' }] },
  { root: 'ju', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to want' }] },
  { root: 'jun', isRoot: true, definitions: [{ pos: 'noun', meaning: 'middle, center' }] },
  { root: 'ka', isRoot: true, definitions: [{ pos: 'noun', meaning: 'kind' }] },
  { root: 'kan', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to become, to turn into' }] },
  { root: 'kawa', isRoot: false, definitions: [{ pos: 'noun', meaning: 'language, dialect, accent' }] },
  { root: 'ke', isRoot: true, definitions: [{ pos: 'verb', meaning: 'can' }, { pos: 'modifier', meaning: 'able' }] },
  { root: 'ken', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'hot, warm' }] },
  { root: 'ki', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to know' }] },
  { root: 'kin', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'difficult, hard, challenging' }] },
  { root: 'ko', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'small' }] },
  { root: 'kon', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'soft, gentle' }] },
  { root: 'ku', isRoot: true, definitions: [{ pos: 'noun', meaning: 'what' }] },
  { root: 'kun', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'easy, simple' }] },
  { root: 'la', isRoot: true, definitions: [{ pos: 'noun', meaning: 'person' }] },
  { root: 'lan', isRoot: true, definitions: [{ pos: 'noun', meaning: 'health, wellness' }] },
  { root: 'le', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to see' }] },
  { root: 'len', isRoot: true, definitions: [{ pos: 'noun', meaning: 'air, gas, breath' }] },
  { root: 'li', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'inside' }] },
  { root: 'lin', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'long, extended' }] },
  { root: 'lo', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to live' }] },
  { root: 'lon', isRoot: true, definitions: [{ pos: 'noun', meaning: 'tool, instrument, implement' }] },
  { root: 'lu', isRoot: true, definitions: [{ pos: 'noun', meaning: '3rd-person' }] },
  { root: 'lun', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to control, to manage, to direct' }] },
  { root: 'ma', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to move' }] },
  { root: 'man', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'round, circular' }] },
  { root: 'me', isRoot: true, definitions: [{ pos: 'noun', meaning: 'side' }] },
  { root: 'men', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to give, to provide, to offer' }] },
  { root: 'mi', isRoot: true, definitions: [{ pos: 'noun', meaning: '1st-person' }] },
  { root: 'min', isRoot: true, definitions: [{ pos: 'noun', meaning: 'house, dwelling, home' }] },
  { root: 'mo', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'far' }] },
  { root: 'mon', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'dirty, unclean, filthy' }] },
  { root: 'mu', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'good' }] },
  { root: 'mun', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to love, to care for' }] },
  { root: 'pa', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to think' }] },
  { root: 'pan', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to sleep, to rest' }] },
  { root: 'pe', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to try' }] },
  { root: 'pen', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to join, to connect, to unite' }] },
  { root: 'pi', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'more' }] },
  { root: 'pin', isRoot: true, definitions: [{ pos: 'noun', meaning: 'sound, noise, audio' }] },
  { root: 'po', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'after' }] },
  { root: 'pon', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'new, fresh, recent' }] },
  { root: 'pu', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'bad' }] },
  { root: 'pun', isRoot: true, definitions: [{ pos: 'noun', meaning: 'animal, creature, beast' }] },
  { root: 'sa', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'many' }] },
  { root: 'san', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'fast, quick, rapid' }] },
  { root: 'se', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'same' }] },
  { root: 'sen', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to harm, to hurt, to damage' }] },
  { root: 'si', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'this' }] },
  { root: 'sin', isRoot: true, definitions: [{ pos: 'noun', meaning: 'colour, hue, shade' }] },
  { root: 'so', isRoot: true, definitions: [{ pos: 'noun', meaning: 'time' }] },
  { root: 'son', isRoot: true, definitions: [{ pos: 'noun', meaning: 'shape, form, figure' }] },
  { root: 'su', isRoot: true, definitions: [{ pos: 'noun', meaning: 'word' }] },
  { root: 'sun', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to play, to have fun' }] },
  { root: 'ta', isRoot: true, definitions: [{ pos: 'noun', meaning: 'place' }] },
  { root: 'te', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'not' }] },
  { root: 'ti', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'few' }] },
  { root: 'to', isRoot: true, definitions: [{ pos: 'noun', meaning: '2nd-person' }] },
  { root: 'tu', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to do' }] },
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
  { root: 'wa', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to speak' }] },
  { root: 'we', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'other' }] },
  { root: 'wi', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'some' }] },
  { root: 'wo', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to touch' }] },
  { root: 'wu', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to like' }] },
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
