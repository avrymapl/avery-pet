'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, Suspense } from 'react';

// Dictionary data structure
const dictionaryData = [
  { root: 'ba', definitions: [{ pos: 'noun', meaning: 'part' }] },
  { root: 'be', definitions: [{ pos: 'noun', meaning: 'cause' }, { pos: 'verb', meaning: 'to cause' }] },
  { root: 'bi', definitions: [{ pos: 'verb', meaning: 'to have' }] },
  { root: 'bo', definitions: [{ pos: 'modifier', meaning: 'before' }] },
  { root: 'bu', definitions: [{ pos: 'verb', meaning: 'to make' }] },
  { root: 'da', definitions: [{ pos: 'noun', meaning: 'thing' }] },
  { root: 'de', definitions: [{ pos: 'noun', meaning: 'body' }] },
  { root: 'di', definitions: [{ pos: 'verb', meaning: 'to die' }] },
  { root: 'do', definitions: [{ pos: 'verb', meaning: 'to come' }] },
  { root: 'du', definitions: [{ pos: 'modifier', meaning: 'big' }] },
  { root: 'ga', definitions: [{ pos: 'modifier', meaning: 'near' }] },
  { root: 'ge', definitions: [{ pos: 'modifier', meaning: 'above' }] },
  { root: 'gi', definitions: [{ pos: 'verb', meaning: 'to hear' }] },
  { root: 'go', definitions: [{ pos: 'modifier', meaning: 'below' }] },
  { root: 'gu', definitions: [{ pos: 'modifier', meaning: 'all' }] },
  { root: 'ja', definitions: [{ pos: 'verb', meaning: 'to break' }] },
  { root: 'je', definitions: [{ pos: 'verb', meaning: 'to feel' }] },
  { root: 'ji', definitions: [{ pos: 'modifier', meaning: 'true' }] },
  { root: 'jo', definitions: [{ pos: 'verb', meaning: 'to need' }] },
  { root: 'ju', definitions: [{ pos: 'verb', meaning: 'to want' }] },
  { root: 'ka', definitions: [{ pos: 'noun', meaning: 'kind' }] },
  { root: 'ke', definitions: [{ pos: 'verb', meaning: 'can' }, { pos: 'modifier', meaning: 'able' }] },
  { root: 'ki', definitions: [{ pos: 'verb', meaning: 'to know' }] },
  { root: 'ko', definitions: [{ pos: 'modifier', meaning: 'small' }] },
  { root: 'ku', definitions: [{ pos: 'noun', meaning: 'what' }] },
  { root: 'la', definitions: [{ pos: 'noun', meaning: 'person' }] },
  { root: 'le', definitions: [{ pos: 'verb', meaning: 'to see' }] },
  { root: 'li', definitions: [{ pos: 'modifier', meaning: 'inside' }] },
  { root: 'lo', definitions: [{ pos: 'verb', meaning: 'to live' }] },
  { root: 'lu', definitions: [{ pos: 'noun', meaning: '3rd-person' }] },
  { root: 'ma', definitions: [{ pos: 'verb', meaning: 'to move' }] },
  { root: 'me', definitions: [{ pos: 'noun', meaning: 'side' }] },
  { root: 'mi', definitions: [{ pos: 'noun', meaning: '1st-person' }] },
  { root: 'mo', definitions: [{ pos: 'modifier', meaning: 'far' }] },
  { root: 'mu', definitions: [{ pos: 'modifier', meaning: 'good' }] },
  { root: 'pa', definitions: [{ pos: 'verb', meaning: 'to think' }] },
  { root: 'pe', definitions: [{ pos: 'verb', meaning: 'to try' }] },
  { root: 'pi', definitions: [{ pos: 'modifier', meaning: 'more' }] },
  { root: 'po', definitions: [{ pos: 'modifier', meaning: 'after' }] },
  { root: 'pu', definitions: [{ pos: 'modifier', meaning: 'bad' }] },
  { root: 'sa', definitions: [{ pos: 'modifier', meaning: 'many' }] },
  { root: 'se', definitions: [{ pos: 'modifier', meaning: 'same' }] },
  { root: 'si', definitions: [{ pos: 'modifier', meaning: 'this' }] },
  { root: 'so', definitions: [{ pos: 'noun', meaning: 'time' }] },
  { root: 'su', definitions: [{ pos: 'noun', meaning: 'word' }] },
  { root: 'ta', definitions: [{ pos: 'noun', meaning: 'place' }] },
  { root: 'te', definitions: [{ pos: 'modifier', meaning: 'not' }] },
  { root: 'ti', definitions: [{ pos: 'modifier', meaning: 'few' }] },
  { root: 'to', definitions: [{ pos: 'noun', meaning: '2nd-person' }] },
  { root: 'tu', definitions: [{ pos: 'verb', meaning: 'to do' }] },
  { root: 'wa', definitions: [{ pos: 'verb', meaning: 'to speak' }] },
  { root: 'we', definitions: [{ pos: 'modifier', meaning: 'other' }] },
  { root: 'wi', definitions: [{ pos: 'modifier', meaning: 'some' }] },
  { root: 'wo', definitions: [{ pos: 'verb', meaning: 'to touch' }] },
  { root: 'wu', definitions: [{ pos: 'verb', meaning: 'to like' }] },
];

function DictionaryContent() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  // Filter dictionary data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return dictionaryData;

    const term = searchTerm.toLowerCase();
    return dictionaryData.filter((entry) => {
      return (
        entry.root.includes(term) ||
        entry.definitions.some((def) => def.meaning.toLowerCase().includes(term))
      );
    });
  }, [searchTerm]);

  return (
    <div className="dictionary-page">
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
