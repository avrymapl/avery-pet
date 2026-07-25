import { Article } from "@/components/Article";
import { Example } from "@/components/Example";
import { Callout } from "@/components/Callout";

export const metadata = {
  title: "lexicon — kawaba",
};

export default function KawabaLexicon() {
  return (
    <Article>
      <h1>lexicon</h1>
      <p>
        Kawaba has just 130 <strong>morphemes</strong>, the smallest units of meaning that cannot be 
        broken down any further. There are two types of morphemes, each just one syllable: 
      </p>
      <ul>
        <li>
          <strong>110 lexical roots</strong> – express the basic meaning of words
        </li>
        <li>
          <strong>20 grammatical markers</strong> – express the relationships between words
        </li>
      </ul>
              <table className="table-uniform">
            <thead>
                <tr>
                    <th></th>
                    <th scope="col">-a</th>
                    <th scope="col">-e</th>
                    <th scope="col">-i</th>
                    <th scope="col">-o</th>
                    <th scope="col">-u</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">b-</th>
                    <td>part</td>
                    <td>cause</td>
                    <td>have</td>
                    <td>before</td>
                    <td>make</td>
                </tr>
                <tr>
                    <th scope="row">d-</th>
                    <td>thing</td>
                    <td>body</td>
                    <td>die</td>
                    <td>come</td>
                    <td>big</td>
                </tr>
                <tr>
                    <th scope="row">g-</th>
                    <td>near</td>
                    <td>above</td>
                    <td>hear</td>
                    <td>below</td>
                    <td>all</td>
                </tr>
                <tr>
                    <th scope="row">j-</th>
                    <td>break</td>
                    <td>feel</td>
                    <td>true</td>
                    <td>need</td>
                    <td>want</td>
                </tr>
                <tr>
                    <th scope="row">k-</th>
                    <td>kind</td>
                    <td>can</td>
                    <td>know</td>
                    <td>small</td>
                    <td>what</td>
                </tr>
                <tr>
                    <th scope="row">l-</th>
                    <td>person</td>
                    <td>see</td>
                    <td>inside</td>
                    <td>live</td>
                    <td>3rd-person</td>
                </tr>
                <tr>
                    <th scope="row">m-</th>
                    <td>move</td>
                    <td>side</td>
                    <td>1st-person</td>
                    <td>far</td>
                    <td>good</td>
                </tr>
                <tr>
                    <th scope="row">p-</th>
                    <td>think</td>
                    <td>try</td>
                    <td>more</td>
                    <td>after</td>
                    <td>bad</td>
                </tr>
                <tr>
                    <th scope="row">s-</th>
                    <td>many</td>
                    <td>same</td>
                    <td>this</td>
                    <td>time</td>
                    <td>word</td>
                </tr>
                <tr>
                    <th scope="row">t-</th>
                    <td>place</td>
                    <td>not</td>
                    <td>few</td>
                    <td>2nd-person</td>
                    <td>do</td>
                </tr>
                <tr>
                    <th scope="row">w-</th>
                    <td>speak</td>
                    <td>other</td>
                    <td>some</td>
                    <td>touch</td>
                    <td>like</td>
                </tr>
            </tbody>
        </table>
    </Article>
  );
}