import { MDXRemote } from 'next-mdx-remote/rsc';
import { docsComponents } from '@/lib/docsComponents';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import remarkGfm from 'remark-gfm';

export default async function LexiconPage() {
  // read mdx file
  const filePath = path.join(
    process.cwd(),
    'src/content/kawaba/phonology/consonants.mdx'
  );

  // for now, inline content (or read from file once you create it)
  const content = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, 'utf8')
    : `
# lexicon

*kawaba* has a minimal lexicon of 130 roots words, 110 lexical and 20 grammatical, that are combined agglutinatively to build complex meaning.
these are further divided into basic roots, the most fundamental concepts, and additional roots that expand on these core ideas.

## basic roots
### lexical roots
|    | -a     | -e    | -i         | -o         | -u         |
|----|--------|-------|------------|------------|------------|
| b- | part   | cause | have       | before     | make       |
| d- | thing  | body  | die        | come       | big        |
| g- | near   | above | hear       | below      | all        |
| j- | break  | feel  | true       | need       | want       |
| k- | kind   | can   | know       | small      | what       |
| l- | person | see   | inside     | live       | 3rd-person |
| m- | move   | side  | 1st-person | far        | good       |
| p- | think  | try   | more       | after      | bad        |
| s- | many   | same  | this       | time       | word       |
| t- | place  | not   | few        | 2nd-person | do         |
| w- | speak  | other | some       | touch      | like       |

### grammatical roots
|    | -a       | -e           | -i          | -o      | -u          |
|----|----------|--------------|-------------|---------|-------------|
| ∅- | noun     | modifier     | verb        | numeral | preposition |
| n- | emphasis | confirmation | relativiser | command | question    |

## additional roots
### lexical roots
|    | -an    | -en    | -in       | -on        | -un     |
|----|--------|--------|-----------|------------|---------|
| b- | most   | get    | hole      | cloth      | surface |
| d- | stop   | write  | stone     | female     | stay    |
| g- | group  | strong | eat       | water      | fight   |
| j- | light  | start  | choose    | use        | middle  |
| k- | become | hot    | difficult | soft       | easy    |
| l- | health | air    | long      | tool       | control |
| m- | round  | give   | house     | dirty      | love    |
| p- | sleep  | join   | sound     | new        | animal  |
| s- | fast   | harm   | colour    | shape      | play    |
| t- | place  | not    | few       | 2nd-person | do      |
| w- | speak  | other  | some      | touch      | like    |

### grammatical roots
|    | -an        | -en      | -in      | -on    | -un          |
|----|------------|----------|----------|--------|--------------|
| ∅- | accusative | locative | temporal | dative | instrumental |
| n- | because    | and      | or       | but    | if           |

<Callout type="warning">
the definitions provided here are only rough glosses of the meanings of roots, which often encompass a wider semantic space and may vary with context.
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
        <Link href="/kawaba/phonology">← phonology</Link>
        <Link href="/kawaba/dictionary">dictionary →</Link>
      </div>
    </div>
  );
}
