'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState, Suspense } from 'react';

// Dictionary data structure
const dictionaryData = [
  { root: 'ba', isRoot: true, definitions: [{ pos: 'noun', meaning: 'part, piece, portion, fraction' }] },
  { root: 'be', isRoot: true, definitions: [{ pos: 'noun', meaning: 'cause, reason' }, { pos: 'verb', meaning: 'to cause, to make happen' }] },
  { root: 'bi', isRoot: true, definitions: [{ pos: 'noun', meaning: 'possessions, belongings'}, { pos: 'verb', meaning: 'to have, to own, to hold' }] },
  { root: 'bo', isRoot: true, definitions: [{ pos: 'noun', meaning: 'past, front' }, { pos: 'modifier', meaning: 'before, in front' }] },
  { root: 'bu', isRoot: true, definitions: [{ pos: 'noun', meaning: 'construction' }, { pos: 'verb', meaning: 'to make' }] },
  { root: 'da', isRoot: true, definitions: [{ pos: 'noun', meaning: 'thing, matter, material, substance' }, { pos: 'modifier', meaning: 'physical, material' }] },
  { root: 'de', isRoot: true, definitions: [{ pos: 'noun', meaning: 'body, form' }] },
  { root: 'di', isRoot: true, definitions: [{ pos: 'noun', meaning: 'death' }, { pos: 'verb', meaning: 'to die' }] },
  { root: 'do', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to come' }] },
  { root: 'du', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'big' }] },
  { root: 'ga', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'near' }] },
  { root: 'ge', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'above' }] },
  { root: 'gi', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to hear' }] },
  { root: 'go', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'below' }] },
  { root: 'gu', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'all' }] },
  { root: 'ja', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to break' }] },
  { root: 'je', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to feel' }] },
  { root: 'ji', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'true' }] },
  { root: 'jo', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to need' }] },
  { root: 'ju', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to want' }] },
  { root: 'ka', isRoot: true, definitions: [{ pos: 'noun', meaning: 'kind' }] },
  { root: 'ke', isRoot: true, definitions: [{ pos: 'verb', meaning: 'can' }, { pos: 'modifier', meaning: 'able' }] },
  { root: 'ki', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to know' }] },
  { root: 'ko', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'small' }] },
  { root: 'ku', isRoot: true, definitions: [{ pos: 'noun', meaning: 'what' }] },
  { root: 'la', isRoot: true, definitions: [{ pos: 'noun', meaning: 'person' }] },
  { root: 'le', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to see' }] },
  { root: 'li', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'inside' }] },
  { root: 'lo', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to live' }] },
  { root: 'lu', isRoot: true, definitions: [{ pos: 'noun', meaning: '3rd-person' }] },
  { root: 'ma', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to move' }] },
  { root: 'me', isRoot: true, definitions: [{ pos: 'noun', meaning: 'side' }] },
  { root: 'mi', isRoot: true, definitions: [{ pos: 'noun', meaning: '1st-person' }] },
  { root: 'mo', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'far' }] },
  { root: 'mu', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'good' }] },
  { root: 'pa', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to think' }] },
  { root: 'pe', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to try' }] },
  { root: 'pi', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'more' }] },
  { root: 'po', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'after' }] },
  { root: 'pu', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'bad' }] },
  { root: 'sa', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'many' }] },
  { root: 'se', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'same' }] },
  { root: 'si', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'this' }] },
  { root: 'so', isRoot: true, definitions: [{ pos: 'noun', meaning: 'time' }] },
  { root: 'su', isRoot: true, definitions: [{ pos: 'noun', meaning: 'word' }] },
  { root: 'ta', isRoot: true, definitions: [{ pos: 'noun', meaning: 'place' }] },
  { root: 'te', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'not' }] },
  { root: 'ti', isRoot: true, definitions: [{ pos: 'modifier', meaning: 'few' }] },
  { root: 'to', isRoot: true, definitions: [{ pos: 'noun', meaning: '2nd-person' }] },
  { root: 'tu', isRoot: true, definitions: [{ pos: 'verb', meaning: 'to do' }] },
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
          <span className="toggle-label">Show roots only</span>
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
