'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, Suspense } from 'react';
import Link from 'next/link';

// Lexicon data structure
const lexiconData = [
  { consonant: 'b', vowel: 'a', meaning: 'part', root: 'ba' },
  { consonant: 'b', vowel: 'e', meaning: 'cause', root: 'be' },
  { consonant: 'b', vowel: 'i', meaning: 'have', root: 'bi' },
  { consonant: 'b', vowel: 'o', meaning: 'before', root: 'bo' },
  { consonant: 'b', vowel: 'u', meaning: 'make', root: 'bu' },
  { consonant: 'd', vowel: 'a', meaning: 'thing', root: 'da' },
  { consonant: 'd', vowel: 'e', meaning: 'body', root: 'de' },
  { consonant: 'd', vowel: 'i', meaning: 'die', root: 'di' },
  { consonant: 'd', vowel: 'o', meaning: 'come', root: 'do' },
  { consonant: 'd', vowel: 'u', meaning: 'big', root: 'du' },
  { consonant: 'g', vowel: 'a', meaning: 'near', root: 'ga' },
  { consonant: 'g', vowel: 'e', meaning: 'above', root: 'ge' },
  { consonant: 'g', vowel: 'i', meaning: 'hear', root: 'gi' },
  { consonant: 'g', vowel: 'o', meaning: 'below', root: 'go' },
  { consonant: 'g', vowel: 'u', meaning: 'all', root: 'gu' },
  { consonant: 'j', vowel: 'a', meaning: 'break', root: 'ja' },
  { consonant: 'j', vowel: 'e', meaning: 'feel', root: 'je' },
  { consonant: 'j', vowel: 'i', meaning: 'true', root: 'ji' },
  { consonant: 'j', vowel: 'o', meaning: 'need', root: 'jo' },
  { consonant: 'j', vowel: 'u', meaning: 'want', root: 'ju' },
  { consonant: 'k', vowel: 'a', meaning: 'kind', root: 'ka' },
  { consonant: 'k', vowel: 'e', meaning: 'can', root: 'ke' },
  { consonant: 'k', vowel: 'i', meaning: 'know', root: 'ki' },
  { consonant: 'k', vowel: 'o', meaning: 'small', root: 'ko' },
  { consonant: 'k', vowel: 'u', meaning: 'what', root: 'ku' },
  { consonant: 'l', vowel: 'a', meaning: 'person', root: 'la' },
  { consonant: 'l', vowel: 'e', meaning: 'see', root: 'le' },
  { consonant: 'l', vowel: 'i', meaning: 'inside', root: 'li' },
  { consonant: 'l', vowel: 'o', meaning: 'live', root: 'lo' },
  { consonant: 'l', vowel: 'u', meaning: '3rd-person', root: 'lu' },
  { consonant: 'm', vowel: 'a', meaning: 'move', root: 'ma' },
  { consonant: 'm', vowel: 'e', meaning: 'side', root: 'me' },
  { consonant: 'm', vowel: 'i', meaning: '1st-person', root: 'mi' },
  { consonant: 'm', vowel: 'o', meaning: 'far', root: 'mo' },
  { consonant: 'm', vowel: 'u', meaning: 'good', root: 'mu' },
  { consonant: 'p', vowel: 'a', meaning: 'think', root: 'pa' },
  { consonant: 'p', vowel: 'e', meaning: 'try', root: 'pe' },
  { consonant: 'p', vowel: 'i', meaning: 'more', root: 'pi' },
  { consonant: 'p', vowel: 'o', meaning: 'after', root: 'po' },
  { consonant: 'p', vowel: 'u', meaning: 'bad', root: 'pu' },
  { consonant: 's', vowel: 'a', meaning: 'many', root: 'sa' },
  { consonant: 's', vowel: 'e', meaning: 'same', root: 'se' },
  { consonant: 's', vowel: 'i', meaning: 'this', root: 'si' },
  { consonant: 's', vowel: 'o', meaning: 'time', root: 'so' },
  { consonant: 's', vowel: 'u', meaning: 'word', root: 'su' },
  { consonant: 't', vowel: 'a', meaning: 'place', root: 'ta' },
  { consonant: 't', vowel: 'e', meaning: 'not', root: 'te' },
  { consonant: 't', vowel: 'i', meaning: 'few', root: 'ti' },
  { consonant: 't', vowel: 'o', meaning: '2nd-person', root: 'to' },
  { consonant: 't', vowel: 'u', meaning: 'do', root: 'tu' },
  { consonant: 'w', vowel: 'a', meaning: 'speak', root: 'wa' },
  { consonant: 'w', vowel: 'e', meaning: 'other', root: 'we' },
  { consonant: 'w', vowel: 'i', meaning: 'some', root: 'wi' },
  { consonant: 'w', vowel: 'o', meaning: 'touch', root: 'wo' },
  { consonant: 'w', vowel: 'u', meaning: 'like', root: 'wu' },
];

function LexiconContent() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  // Filter lexicon data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return lexiconData;

    const term = searchTerm.toLowerCase();
    return lexiconData.filter((entry) => {
      return (
        entry.consonant.includes(term) ||
        entry.vowel.includes(term) ||
        entry.root.includes(term) ||
        entry.meaning.toLowerCase().includes(term)
      );
    });
  }, [searchTerm]);

  // Group filtered data by consonant for table display
  const consonants = ['b', 'd', 'g', 'j', 'k', 'l', 'm', 'p', 's', 't', 'w'];
  const vowels = ['a', 'e', 'i', 'o', 'u'];

  return (
    <div>
      <h1>lexicon</h1>
      <p>
        <i>kawaba</i> has a minimal lexicon of 130 roots words, 110 lexical and 20 grammatical,
        that are combined agglutinatively to build complex meaning.
      </p>

      {searchTerm && (
        <div style={{ marginTop: 'var(--gap-md)', marginBottom: 'var(--gap-md)' }}>
          <p style={{ color: 'var(--text-heading)', fontWeight: '500' }}>
            Search results for &quot;{searchTerm}&quot; ({filteredData.length} {filteredData.length === 1 ? 'result' : 'results'})
          </p>
        </div>
      )}

      {searchTerm ? (
        // List view for search results
        <div style={{ marginTop: 'var(--gap-md)' }}>
          {filteredData.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--bg-secondary)' }}>
                  <th style={{ textAlign: 'left', padding: '8px', color: 'var(--text-heading)' }}>Root</th>
                  <th style={{ textAlign: 'left', padding: '8px', color: 'var(--text-heading)' }}>Meaning</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((entry) => (
                  <tr key={entry.root} style={{ borderBottom: '1px solid var(--bg-secondary)' }}>
                    <td style={{ padding: '8px', color: 'var(--text-body)', fontWeight: '500' }}>
                      {entry.root}
                    </td>
                    <td style={{ padding: '8px', color: 'var(--text-body)' }}>
                      {entry.meaning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--text-body)', fontStyle: 'italic' }}>
              No results found for &quot;{searchTerm}&quot;
            </p>
          )}
        </div>
      ) : (
        // Table view for all entries
        <>
          <h2 style={{ marginTop: 'var(--gap-md)' }}>lexical roots</h2>
          <h3>table of basic lexical roots</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 'var(--gap-md)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--bg-secondary)' }}>
                <th style={{ textAlign: 'left', padding: '8px', color: 'var(--text-heading)' }}></th>
                {vowels.map((v) => (
                  <th key={v} style={{ textAlign: 'left', padding: '8px', color: 'var(--text-heading)' }}>
                    -{v}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {consonants.map((c) => (
                <tr key={c} style={{ borderBottom: '1px solid var(--bg-secondary)' }}>
                  <td style={{ padding: '8px', color: 'var(--text-heading)', fontWeight: '500' }}>
                    {c}-
                  </td>
                  {vowels.map((v) => {
                    const entry = lexiconData.find((e) => e.consonant === c && e.vowel === v);
                    return (
                      <td key={`${c}${v}`} style={{ padding: '8px', color: 'var(--text-body)' }}>
                        {entry?.meaning || ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div className="doc-nav" style={{ marginTop: 'var(--gap-md)' }}>
        <Link href="/kawaba/phonology">← phonology</Link>
        <Link href="/kawaba/">→</Link>
      </div>
    </div>
  );
}

export default function LexiconPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LexiconContent />
    </Suspense>
  );
}
