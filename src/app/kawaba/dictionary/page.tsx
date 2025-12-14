'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, Suspense } from 'react';

// Dictionary data structure
const dictionaryData = [
  { root: 'ba', meaning: 'part' },
  { root: 'be', meaning: 'cause' },
  { root: 'bi', meaning: 'have' },
  { root: 'bo', meaning: 'before' },
  { root: 'bu', meaning: 'make' },
  { root: 'da', meaning: 'thing' },
  { root: 'de', meaning: 'body' },
  { root: 'di', meaning: 'die' },
  { root: 'do', meaning: 'come' },
  { root: 'du', meaning: 'big' },
  { root: 'ga', meaning: 'near' },
  { root: 'ge', meaning: 'above' },
  { root: 'gi', meaning: 'hear' },
  { root: 'go', meaning: 'below' },
  { root: 'gu', meaning: 'all' },
  { root: 'ja', meaning: 'break' },
  { root: 'je', meaning: 'feel' },
  { root: 'ji', meaning: 'true' },
  { root: 'jo', meaning: 'need' },
  { root: 'ju', meaning: 'want' },
  { root: 'ka', meaning: 'kind' },
  { root: 'ke', meaning: 'can' },
  { root: 'ki', meaning: 'know' },
  { root: 'ko', meaning: 'small' },
  { root: 'ku', meaning: 'what' },
  { root: 'la', meaning: 'person' },
  { root: 'le', meaning: 'see' },
  { root: 'li', meaning: 'inside' },
  { root: 'lo', meaning: 'live' },
  { root: 'lu', meaning: '3rd-person' },
  { root: 'ma', meaning: 'move' },
  { root: 'me', meaning: 'side' },
  { root: 'mi', meaning: '1st-person' },
  { root: 'mo', meaning: 'far' },
  { root: 'mu', meaning: 'good' },
  { root: 'pa', meaning: 'think' },
  { root: 'pe', meaning: 'try' },
  { root: 'pi', meaning: 'more' },
  { root: 'po', meaning: 'after' },
  { root: 'pu', meaning: 'bad' },
  { root: 'sa', meaning: 'many' },
  { root: 'se', meaning: 'same' },
  { root: 'si', meaning: 'this' },
  { root: 'so', meaning: 'time' },
  { root: 'su', meaning: 'word' },
  { root: 'ta', meaning: 'place' },
  { root: 'te', meaning: 'not' },
  { root: 'ti', meaning: 'few' },
  { root: 'to', meaning: '2nd-person' },
  { root: 'tu', meaning: 'do' },
  { root: 'wa', meaning: 'speak' },
  { root: 'we', meaning: 'other' },
  { root: 'wi', meaning: 'some' },
  { root: 'wo', meaning: 'touch' },
  { root: 'wu', meaning: 'like' },
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
        entry.meaning.toLowerCase().includes(term)
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
              <p>{entry.meaning}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="box">
          <p style={{ color: 'var(--text-body)', fontStyle: 'italic', margin: 0 }}>
            No results found for &quot;{searchTerm}&quot;
          </p>
        </div>
      )}
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
