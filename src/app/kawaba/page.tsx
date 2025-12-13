import { MDXRemote } from 'next-mdx-remote/rsc';
import { docsComponents } from '@/lib/docsComponents';
import Link from 'next/link';

export default function KawabaHome() {
  const content = `
# kawaba reference grammar

welcome to the complete grammar reference for *kawaba* – the language of parts. *kawaba* is a minimal oligosynthetic constructed language i began working on in 2022 that uses a limited set of 130 root words to build meaning.
this reference grammar assumes some familiarity with linguistic terminology – for an introduction to the language written for a general audience, please read the *kawaba* lessons instead.

## goals

the goal at the heart of this language is:

- **fundamentality** – i want *kawaba* to reflect what is fundamental to human communication. though as awareness of a greater diversity of languages has revealed few linguistic universals, i hope to capture the widespread patterns at the core of how we communicate.

from this foundation follows the secondary goals of:

- **minimalism** – as so little is shared among all the languages of the world, *kawaba* aims to derive meaning with a minimal phonology, lexicon, and grammar common among human languages.

- **regularity** - with few grammatical constraints, *kawaba* aims to use these rules regularly and productively across the language to allow for the construction of complex meaning.

- **flexibility** - given the huge variety among the world's languages, *kawaba* aims to afford flexibility to speakers, with multiple ways to communicate the same thing.

- **neutrality** – though subject to my own linguistic biases, *kawaba* aims to avoid privileging speakers of some language backgrounds over others wherever possible.  

## features

in accordance with these goals, i have created kawaba to display the following features:

- **a priori**

- **sound symbolism**

- **NSM**
`;

  return (
    <div>
      <MDXRemote source={content} components={docsComponents} />
      
      {/* JSX navigation */}
      <div className="doc-nav">
        <div></div>
        <Link href="/kawaba/phonology">phonology →</Link>
      </div>
    </div>
  );
}