import { Article } from "@/components/Article";
import { Callout } from "@/components/Callout";

export const metadata = {
  title: "phonology",
};

export default function KawabaPhonology() {
  return (
    <Article>
      <h1>phonology</h1>
      <p>
        Kawaba has 17 phonemes: 12 consonants and 5 vowels. These were chosen due to their frequency across the world&rsquo;s languages and ability to be distinguished clearly. The International Phonetic Alphabet transcriptions given here represent a standard pronunciation, though individuals&rsquo; pronunciation can vary as long as each segment is distinct.
      </p>
      <h2>consonants</h2>
      <p>
        Kawaba has 12 consonants, shown in the table below. these are the 12 most common consonants among languages according to <a href="https://phoible.org/parameters">phoible.org</a>, excluding:
      </p>
      <ul>
        <li>
          <strong>/h/</strong> – as it lacks the usual phonetic features of a consonant and behaviours closer to a manner of phonation. It is difficult to distinguish for speakers of languages that lack it.
        </li>
        <li>
          <strong>/ŋ/</strong> – as it is restricted to the coda of syllables in many languages. As a coda, it is already an allophone of <strong>/n/</strong> before a velar consonant.
        </li>
      </ul>
      <p>
        Additionally, the voiceless stops are aspirated for speakers of languages that distinguish stops primarily by aspiration rather than voicing.
      </p>
      <table>
        <thead>
          <tr>
            <th></th>
            <th scope="col">labial</th>
            <th scope="col">coronal</th>
            <th scope="col">dorsal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">nasal</th>
            <td>m</td>
            <td>n</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row" rowSpan={2}>plosive</th>
            <td>p /pʰ/</td>
            <td>t /tʰ/</td>
            <td>k /kʰ/</td>
          </tr>
          <tr>
            <td>b</td>
            <td>d</td>
            <td>ɡ</td>
          </tr>
          <tr>
            <th scope="row">fricative</th>
            <td></td>
            <td>s</td>
            <td></td>
          </tr>
          <tr>
            <th scope="row">approximant</th>
            <td>w</td>
            <td>l</td>
            <td>j</td>
          </tr>
        </tbody>
      </table>
      <Callout>
        <p>
          The segment <strong>/n/</strong> is pronounced as the voiced alveolar nasal as the onset of a syllable, but can undergo assimilation with the place of the following segment as a coda.
        </p>
      </Callout>
      <h2>vowels</h2>
      <p>
        Kawaba has 5 vowels, shown in the table below. These are evenly spaced along the periphery of the vowel space.
      </p>
      <ul>
        <li><strong>/ä/</strong> is the open central unrounded vowel, between <strong>/a/</strong> and <strong>/ɑ/</strong></li>
        <li><strong>/e̞/</strong> is the mid front unrounded vowel, between <strong>/e/</strong> and <strong>/ɛ/</strong></li>
        <li><strong>/o̞/</strong> is the mid back rounded vowel, between <strong>/o/</strong> and <strong>/ɔ/</strong></li>
      </ul>
      <table className="table-">
        <thead>
          <tr>
            <th></th>
            <th scope="col">front</th>
            <th scope="col">central</th>
            <th scope="col">back</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">close</th>
            <td>i</td>
            <td></td>
            <td>u</td>
          </tr>
          <tr>
            <th scope="row">mid</th>
            <td>e /e̞/</td>
            <td></td>
            <td>o /o̞/</td>
          </tr>
          <tr>
            <th scope="row">open</th>
            <td></td>
            <td>a /ä/</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <Callout>
        <p>
          The semivowels <strong>/j/</strong> and <strong>/w/</strong> have a shorter duration and involve a transitionary glide to the following vowel, while the vowels <strong>/i/</strong> and <strong>/u/</strong> are longer and remain stable. The syllables <strong>/ji/</strong> and <strong>/wu/</strong> have an initial glide, while <strong>/i/</strong> and <strong>/u/</strong> do not.
        </p>
      </Callout>
      <h2>stress</h2>
      <p>
        Primary stress falls on the first root of a word, which is the second syllable for words with a prefix. Secondary stress falls on syllables following a hyphen in a compound word. Stressed syllables are pronounced with a higher pitch and longer duration than unstressed syllables.
      </p>
    </Article>
  );
}
