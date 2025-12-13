import { MDXRemote } from 'next-mdx-remote/rsc';
import { docsComponents } from '@/lib/docsComponents';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import remarkGfm from 'remark-gfm';

export default async function ConsonantsPage() {
  // read mdx file
  const filePath = path.join(
    process.cwd(),
    'src/content/kawaba/phonology/consonants.mdx'
  );
  
  // for now, inline content (or read from file once you create it)
  const content = fs.existsSync(filePath) 
    ? fs.readFileSync(filePath, 'utf8')
    : `
# phonology

the phonology of *kawaba* has 17 phonemes: 12 consonants and 5 vowels. these were chosen due to their frequency across the world's languages and ability to be distinguished clearly.
the International Phonetic Alphabet transcriptions given here represent a standard pronunciation, though individual pronunciation can vary as long as each segment is distinct.

### consonant inventory

*kawaba* has 12 consonants, shown in the table below. these are the 12 most common consonants among languages according to [phoible.org](https://phoible.org/parameters), excluding:

- **/h/** – as it lacks the usual phonetic features of a consonant. acting closer to a manner of phonation, it is a difficult segment to distinguish for speakers of languages that do not feature it.

- **/ŋ/** – as it is restricted to the syllable coda in many languages. in the syllable final position, it is already an allophone of 'n' when undergoing assimilation before a velar consonant.

additionally, the voiceless stops are aspirated for speakers of languages that distinguish stops primarily by aspiration rather than voicing.

| | labial | apical | laminal | dorsal |
|-------|-------|-------|-------|-------|
| nasal | m | n | | |
| stop (aspirated) | p /pʰ/ | t /tʰ/ | | k /kʰ/ |
| stop (voiced) | b | d | | ɡ |
| fricative | | | s | |
| approximant | | l | j | w |

<Callout type="info">
the segment **/n/** is pronounced as a voiced alveolar nasal at the beginning of a syllable, though can undergo place assimilation with the following segment when it occurs syllable finally.
</Callout>

### vowel inventory

kawaba has 5 vowels, equally spaced along the periphery of the vowel space.

- **/ä/** is the open central unrounded vowel, between /a/ and /ɑ/
- **/e̞/** is the mid front unrounded vowel, between /e/ and /ɛ/
- **/o̞/** is the mid back rounded vowel, between /o/ and /ɔ/

| | front | central | back |
|-------|-------|-------|-------|
| close | i | | u |
| mid | e /e̞/ | | /o̞/ |
| open | | a /ä/ | | 

<Callout type="info">
the semivowels **/j/** and **/w/** have a shorter duration and involve a transitionary glide to the following vowel, while the vowels **/i/** and **/u/** have a longer duration and remain stable across their pronunciation.
the syllables **/ji/** and **/wu/** will have this initial glide, while **/i/** and **/u/** will not.
</Callout>
    `;

  return (
    <div>
      <MDXRemote 
        source={content} 
        components={docsComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm], 
          },
        }}
      />      
      <div className="doc-nav">
        <Link href="/kawaba">← introduction</Link>
        <Link href="/kawaba/lexicon">lexicon →</Link>
      </div>
    </div>
  );
}