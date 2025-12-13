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
# lexicon

*kawaba* has a minimal lexicon of 130 roots words, 110 lexical and 20 grammatical, that are combined agglutinatively to build complex meaning. 

## lexical roots

### table of basic lexical roots

| | -a | -e | -i | -o | -u |
|-------|-------|-------|-------|-------|-------|
| b- | part | cause | have | before | make |
| d- | thing | body | die | come | big |
| g- | near | above | hear | below | all |
| j- | break | feel | true | need | want |
| k- | kind | can | know | small | what |
| l- | person | see | inside | live | 3rd-person |
| m- | move | side | 1st-person | far | good |
| p- | think | try | more | after | bad |
| s- | many | same | this | time | word |
| t- | place | not | few | 2nd-person | do |
| w- | speak | other | some | touch | like |
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
        <Link href="/kawaba/"> →</Link>
      </div>
    </div>
  );
}